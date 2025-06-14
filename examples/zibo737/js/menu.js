const menuItems = [
    {
        file: 'views.html',
        title: 'Views',
    },
    {
        file: 'web-fmc.html',
        title: 'FMC',
    },
    {
        file: 'gauges.html',
        title: 'Gauges',
    },
];
const buildMenu = (parentId, currentFile) => {
    const parentElement = document.getElementById(parentId);
    menuItems.forEach(itemDef => {
        const item = document.createElement('a');
        item.innerText = itemDef.title;
        if (itemDef.file === currentFile) {
            item.className = 'selected-menu-item menu-item';
        } else {
            item.className = 'unselected-menu-item menu-item';
            item.onclick = () => window.location = itemDef.file;
        }
        parentElement.appendChild(item);
    });
}