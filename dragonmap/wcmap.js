//сперва включить файл settings.js

function getter(el) {
	var dom_element = el;
	return function(data) {
		var resp = data.split('\2');
		var index = 0;
		var cl = ''; //класс ячейки
		var suf = ''; //путь к рисункам
		var nhtml = '<table class="map-tbl">';
		for (var i = 0; i < glpos.z * binfo.icount; i++) {
			nhtml += '<tr>';
			for (var j = 0; j < glpos.z * binfo.icount; j++) {
				var r = resp[index].split('\1');
				if (r.length < 2) return;
				var cl = 'bg' + r[0] + '_' + glpos.z;
				var fl = parseInt(r[3]);
				var shifted = false;
				//добавляем ячейку к хтмл
				nhtml += '<td class="' + cl + '" tt="' + r[2] + '" fl="' + fl + '">';
				if (r[1].length > 0) {
					if (r[1] == '99999') r[1] = '0';
					suf = 'un';
					if (glpos.z > 1) suf += '_' + glpos.z;
					nhtml += '<img src="img/' + suf + '/' + r[1] + '.gif" alt="Q"';
					nhtml += ' />';
					if (fl & 3) {
						nhtml += '<img class="ind' + (fl & 3);
						nhtml += '" src="img/ind.gif" alt="" />';
					}
					shifted = true;
				}
				//отображаем путь
				var x = parseInt(el.attributes.x0.value) * binfo.icount + j + 1;
				var y = parseInt(el.attributes.y0.value) * binfo.icount + i + 1;
				if (path[x * 10000 + y]) {
					nhtml += '<img src="img/ovr_' + glpos.z + '/path.gif" alt="O" class="ovr';
					if (shifted) nhtml += ' shift';
					nhtml += '" tcost="' + path[x * 10000 + y].t + '"';
					nhtml += '" />';
					shifted = true;
				}
				//дополнительные флаги
				//fl&3  -- признак дип. отношений (0 - нет, 1 - союз, 2 - враг, 3 - соклан)
				//fl&4  -- клетка устарела
				//fl&8  -- нельзя ставить город
				if (fl & 4) {
					nhtml += '<img src="img/ovr_' + glpos.z + '/black.gif" alt="O" class="op';
					if (shifted) nhtml += ' shift';
					nhtml += '" />';
					shifted = true;
				}
				if (fl & 8) {
					nhtml += '<img src="img/ovr_' + glpos.z + '/red.gif" alt="O" class="op';
					if (shifted) nhtml += ' shift';
					nhtml += '" />';
					shifted = true;
				}
				nhtml += '</td>';
				index++;
			}
			nhtml += '</tr>';
		}
		nhtml += '</table>';
		dom_element.innerHTML = nhtml;
		dom_element.req = 0;
	};
}

function getdata(i, d) {
	//i - индекс
	//d - элемент DOM
	var _x1 = parseInt(d.attributes.x0.value) * glpos.z * binfo.icount + 1;
	var _y1 = parseInt(d.attributes.y0.value) * glpos.z * binfo.icount + 1;
	var _x2 = _x1 + glpos.z * binfo.icount - 1;
	var _y2 = _y1 + glpos.z * binfo.icount - 1;
	if (d.req) {
		//отменяем прошлый запрос
		d.req.abort();
	}
	var args = {
		x1: _x1,
		x2: _x2,
		y1: _y1,
		y2: _y2,
		fl: flags
	};
	if (flags & 2) args.od = Math.floor($('#od').val() * 24);
	d.req = $.get(gdscript, args, getter(d));
}

function fixpos(el, x, pos, dattr) {
	if (x) {
		el.style.left = pos + 'px';
		el.attributes.x0.value = parseInt(el.attributes.x0.value) + dattr;
	} else {
		el.style.top = pos + 'px';
		el.attributes.y0.value = parseInt(el.attributes.y0.value) + dattr;
	}
	el.innerHTML = emptystr;
	var x0 = parseInt(el.attributes.x0.value);
	var y0 = parseInt(el.attributes.y0.value);
	if (x0 >= 0 && y0 >= 0 && x0 < binfo.bcount && y0 < binfo.bcount) {
		el.style.backgroundColor = 'blue';
		getdata(0, el);
	} else el.style.backgroundColor = 'black';
}

function createcontainers() {
	dmap
		.empty()
		.width($('body').width() - 311);
	$('.menu').css('top', 0).css('left', dmap.width());
	xc = Math.ceil(dmap.width() / binfo.bsize) + 1;
	yc = Math.ceil(dmap.height() / binfo.bsize) + 1;
	//устанавливаем ограничения на глобальные позиции
	dw = dmap.width();
	dh = dmap.height();
	localStorage["dw"] = dw;
	localStorage["dh"] = dh;
	glpos_c.maxx = Math.floor(binfo.bsize * binfo.bcount / glpos.z - dmap.width());
	glpos_c.maxy = Math.floor(binfo.bsize * binfo.bcount / glpos.z - dmap.height());
	glpos.x = Math.floor(center.x * binfo.isize / glpos.z - dw / 2) + 1;
	glpos.y = Math.floor(center.y * binfo.isize / glpos.z - dh / 2) + 1;
	var i0 = Math.floor(glpos.y / binfo.bsize);
	var j0 = Math.floor(glpos.x / binfo.bsize);
	for (var i = i0; i < i0 + yc; i++) {
		for (var j = j0; j < j0 + xc; j++) {
			$('<div class="container">' + emptystr + '</div>')
				.width(binfo.bsize)
				.height(binfo.bsize)
				.css('left', Math.floor(j * binfo.bsize - glpos.x))
				.css('top', Math.floor(i * binfo.bsize - glpos.y))
				.appendTo(dmap)
				.attr({
					x0: j,
					y0: i,
				})
				.each(getdata);
		}
	}
	containers = $('.container');
}

function moveblocks(dx, dy, force) {
	if (!force) {
		if ((dx > 0 && glpos.x <= glpos_c.minx) || (dx < 0 && glpos.x >= glpos_c.maxx)) dx = 0;
		if ((dy > 0 && glpos.y <= glpos_c.miny) || (dy < 0 && glpos.y >= glpos_c.maxy)) dy = 0;
	}
	glpos.x -= dx;
	glpos.y -= dy;
	containers.each(function(i, el) {
		l = parseInt(el.style.left) + dx;
		t = parseInt(el.style.top) + dy;
		el.style.left = l + 'px';
		el.style.top = t + 'px';
		//перекидываем блоки
		if (l - (xc - 1) * binfo.bsize > 0) fixpos(el, 1, l - xc * binfo.bsize, -xc);
		else if (l + xc * binfo.bsize < dw) fixpos(el, 1, l + xc * binfo.bsize, xc);
		if (t - (yc - 1) * binfo.bsize > 0) fixpos(el, 0, t - yc * binfo.bsize, -yc);
		else if (t + yc * binfo.bsize < dh) fixpos(el, 0, t + yc * binfo.bsize, yc);
	});
}

function fixglposanim() {
	//фиксируем положение экрана
	var dx = 0;
	var dy = 0;
	var step = 20;
	if (glpos.x < glpos_c.minx) dx = -Math.min(step, Math.abs(glpos.x - glpos_c.minx));
	else if (glpos.x > glpos_c.maxx) dx = Math.min(step, Math.abs(glpos.x - glpos_c.maxx));
	if (glpos.y < glpos_c.miny) dy = -Math.min(step, Math.abs(glpos.y - glpos_c.miny));
	else if (glpos.y > glpos_c.maxy) dy = Math.min(step, Math.abs(glpos.y - glpos_c.maxy));
	if (dx || dy) moveblocks(dx, dy, true);
}

function get_mm_coord(e) {
	var pos = $('#imap').offset();
	var res = {
		x: Math.floor((e.clientX - pos.left) + 1),
		y: Math.floor((e.clientY - pos.top) + 1)
	};
	return res;
}

function update() {
	var storedX = parseInt(localStorage['x']);
	var storedY = parseInt(localStorage['y']);
	if(storedX != center.x || storedY != center.y) {
		center.x = storedX;
		center.y = storedY;
		glpos.x = Math.floor(storedX * binfo.isize - dw / 2);
		glpos.y = Math.floor(storedY * binfo.isize - dh / 2);
		createcontainers();
	}
	else {
		//запоминаем позицию обзора
		var newx = Math.floor((glpos.x + dw / 2) / binfo.isize / glpos.z);
		var newy = Math.floor((glpos.y + dh / 2) / binfo.isize / glpos.z);
		if ((newx != center.x) || (newy != center.y)) {
			center.x = newx;
			center.y = newy;
			localStorage['x'] = center.x;
			localStorage['y'] = center.y;
			localStorage['d'] = od;
		}
	}
	//обновляем положение рамки на миникарте
	$('#frm')
		.css({
			left: Math.floor(glpos.x * scale),
			top: Math.floor(glpos.y * scale),
			width: Math.floor(dw * scale),
			height: Math.floor(dh * scale),
		});
	//меняем ссылку на область видимости
	var newlink = link + '/?x=' + center.x + '&y=' + center.y;
	$('#url2').val(newlink);
	//обновляем позицию в адресной строке
	if(history && history.replaceState)
		history.replaceState(null, null, newlink)
}

function startpage() {
	//устанавливаем обработчики
	dmap = $('#dmap')
		.mouseout(function(e) {
			$('#tt').css('display', 'none');
		})
		.mouseover(function(e) {
			var cell = (e.target.attributes.tt && e.target) || (e.target.parentNode.attributes.tt && e.target.parentNode);
			if (cell) {
				var tips = cell.attributes.tt.value;
				var fl = cell.attributes.fl.value;
				var tip = '<table><tr><td>';
				tips = tips.split('$');
				if (tips[0].length) tip += tips[0] + '<br/>'
				if (tips[1].length) tip += tips[1] + '<br/>';
				if (tips[2].length) {
					tip += '<span class="name' + (fl & 3) + '"><b>' + tips[2] + '</b>';
					if (tips[3].length) tip += ' [' + tips[3] + ']</span>';
					tip += '</span><br/>';
				}
				tip += tips[4] + '<br/>';
				tip += '<i>' + tips[5] + '</i><br/>';
				tip += '<span class="date">' + tips[6] + '</span><br/>';
				if (cell.childNodes.length)
					for (var child in cell.childNodes)
						if (cell.childNodes[child].attributes && cell.childNodes[child].attributes.tcost)
							tip += 'Затраты ходов: ' + cell.childNodes[child].attributes.tcost.value;
				tip += '</td></tr></table>';
				var dx = 10,
					dy = 10;
				var tt = $('#tt').css({
						left: (e.clientX + dx) + 'px',
						top: (e.clientY + dy) + 'px',
						display: 'block'
					})
					.html(tip);
				if (tt.offset().left + tt.width() > $('body').width) {
					tt.css('left', (e.clientX - dx - tt.width()) + 'px')
				}
				if (tt.offset().top + tt.height() > $('body').height()) {
					tt.css('top', (e.clientY - dy - tt.height()) + 'px')
				}
			}
		})
		.mousedown(function(e) {
			if (e.which == 1) {
				this.style.cursor = 'url(http://maps.gstatic.com/intl/ru_ru/mapfiles/closedhand_8_8.cur), move';
				minfo.mdown = 1;
				minfo.oldx = e.clientX;
				minfo.oldy = e.clientY;
				return false;
			}
		})
		.mouseup(function(e) {
			if (e.which == 1) {
				this.style.cursor = 'url(http://maps.gstatic.com/intl/ru_ru/mapfiles/openhand_8_8.cur), default';
				minfo.mdown = 0;
			}
		})
		.mousemove(function(e) {
			if (minfo.mdown) {
				var dx = e.clientX - minfo.oldx;
				var dy = e.clientY - minfo.oldy;
				minfo.oldx = e.clientX;
				minfo.oldy = e.clientY;
				moveblocks(dx, dy, false);
			}
		});
	//*******************************************************
	$('#mmap')
		.attr('offset_normal', $('#mmap').attr('offsetLeft'))
		.attr('offset_left', parseInt($('#mmap').attr('offsetLeft')) - 768)
		.click(function(e) {
			if (e.shiftKey) {
				openMinMap();
			} else {
				center = get_mm_coord(e);
				center.x = Math.floor(center.x / mmapscale);
				center.y = Math.floor(center.y / mmapscale);
				localStorage['x'] = center.x;
				localStorage['y'] = center.y;
				createcontainers();
			}
			return false;
		})
		.mouseleave(function(e) {
			$('#tt').css('display', 'none');
		})
		.mousemove(function(e) {
			var pos = get_mm_coord(e);
			if (!overmmap) {
				pos.x *= 4;
				pos.y *= 4;
			}
			var dx = 20;
			var dy = 20;
			var nhtml = '';
			$('#tt').html('<table><tr><td>' + pos.x + ':' + pos.y + '</td></tr></table>')
				.css({
					top: (e.clientY + dy + 1) + 'px',
					left: (e.clientX + dx + 1) + 'px',
					display: 'block'
				});
			var tt = $('#tt');
			var off = tt.offset();
			if (off.left + tt.width() > $('body').width()) {
				tt.css('left', (e.clientX - dx - tt.width()) + 'px')
			}
			if (off.top + tt.height() > $('body').height()) {
				tt.css('top', (e.clientY - dy - tt.height()) + 'px')
			}
			return false;
		});
	$('input')
		.click(function(e) {
			this.select();
		})
		.filter('#xy')
		.change(function() {
			var res = $(this).val().match(/(\d+).(\d+)/);
			if (res) {
				center.x = parseInt(res[1]);
				center.y = parseInt(res[2]);
				createcontainers();
			}
			$(this).val(center.x + ':' + center.y);
		})
		.end()
		.filter('#od')
		.change(function() {
			var res = parseFloat($(this).val());
			if (res) {
				od = Math.floor(res * 24);
				if (flags & 2) createcontainers();
			}
			$(this).val(od / 24);
		})
		.end()
		.filter('#updm')
		.each(function() {
			this.updnow = false;
		})
		.click(function() {
			if (!this.updnow) {
				var buttn = this;
				buttn.updnow = true;
				$.get(mmscript, {}, function(data, textstatus) {
					$('#imap')[0].src = 'img/map.png?' + Math.random();
					buttn.updnow = false;
				});
			}
		});
	//восстанавливаем позицию обзора
	center.x = parseInt(localStorage['x'] || worldsize / 2);
	center.y = parseInt(localStorage['y'] || worldsize / 2);
	od = parseInt(localStorage['d'] || od);
	var params = /\?x=(\d+)&y=(\d+)/.exec(document.URL);
	if (params) {
		center.x = parseInt(params[1]);
		center.y = parseInt(params[2]);
	}
	//создаем границы материков на миникарте (спрятанными)
	var mmap = $('#mmap');
	var imap = $('#imap');
	for (var i in lands) {
		mmap.append('<div class="brdland" tt="' + i + '" \
style="left:' + Math.floor(lands[i][0] * mmapscale) + 'px;top:' + Math.floor(lands[i][1] * mmapscale) + 'px;\
width:' + Math.floor(lands[i][2] * mmapscale) + 'px;height:' + Math.floor(lands[i][3] * mmapscale) + 'px;\
background-image:url(../img/st/continent' + i + ')\
" ></div>');
	}
	$('[tt]', mmap)
		.mouseleave(function(e) {
			$('#tt').css({
				display: 'none'
			});
			$(this).css({
				backgroundImage: 'none'
			})
			return true;
		})
		.mouseenter(function(e) {
			$(this).css({
				backgroundImage: 'url(img/st/continent' +
					(parseInt(this.attributes.tt.value) + 1) +
					'.png'
			});
			var pos = get_mm_coord(e);
			var descr = land_descr[parseInt(this.attributes.tt.value)];
			var html = '<table><tr><td><table><tr><td id="tt_coord" colspan="2" align="center">' + pos.x + ':' + pos.y + '</td></tr>'
			html += '<tr><td colspan="2" align="center"><b>' + descr.name + '</b></td></tr>'
			html += '<tr><td>Свободно</td><td>' + descr.free + '/' + descr.area + '</td></tr>';
			for (var i in descr.clans) {
				html += '<tr><td>' + descr.clans[i].name + '</td><td align="center">' + descr.clans[i].area + '%</td></tr>';
			}
			html += '</table></td></tr></table>';
			$('#tt').html(html);
			return false;
		})
		.mousemove(function(e) {
			var pos = get_mm_coord(e);
			var dx = 20;
			var dy = 20;
			$('#tt')
				.find('#tt_coord').html(pos.x + ':' + pos.y).end()
				.css({
					top: (e.clientY + dy + 1) + 'px',
					left: (e.clientX + dx + 1) + 'px',
					display: 'block'
				});
			var tt = $('#tt');
			var off = tt.offset();
			if (off.left + tt.width() > $('body').width()) {
				tt.css('left', (e.clientX - dx - tt.width()) + 'px')
			}
			if (off.top + tt.height() > $('body').height()) {
				tt.css('top', (e.clientY - dy - tt.height()) + 'px')
			}
			return false;
		});
	//создаем контейнеры
	createcontainers();
	setInterval(fixglposanim, 50);
	setInterval(update, 1000);
	//обновляем миникарту
	$('#imap')[0].src = 'img/map.png?' + Math.random();
	$('#opnm')[0].onclick = openMinMap;

	window.addEventListener("storage", update, false);
};

function check_br() {
	flags ^= 1;
	createcontainers();
}

function check_old() {
	flags ^= 2;
	createcontainers();
}

function openMinMap() {
	window.open("/mortal/minmap.html", "minimap", "resizable,scrollbars,status");
}