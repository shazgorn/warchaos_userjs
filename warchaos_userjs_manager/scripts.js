console.log('scripts start');
var scripts = [
    {name: "icon_replacer", events: ["frame_load", "click"]},
    {name: "replace_force_size", events: ["frame_load", "click"]}
];
window.scripts = scripts;
console.log('scripts stop');