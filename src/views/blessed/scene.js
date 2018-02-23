const blessed = require("blessed");
const {version} = require("../../../package.json");

class Scene {
	
	constructor() {
		
		this.views = {};
		
		this.screen = blessed.screen({
				smartCSR: true,
				terminal: "windows-ansi",
				title: `BURST Auto plotter ${version}`,
				cursor: {
					artificial: true,
					shape: 'line',
					blink: false,
				},
			}
		);
		this.screen.enableInput();
		
		// Quit on Escape, q, or Control-C.
		this.screen.key(['escape', 'q', 'C-c'], this.showQuitDialog);
	}
	
	showQuitDialog() {
		
		if (!this.quitDialog) {
			this.quitDialog = blessed.box({
				parent: this.screen,
				hidden: false,
				top: 'center',
				left: 'center',
				width: 'shrink',
				height: 5,
				tags: true,
				keys: true,
				mouse: true,
				shadow: true,
				transparent: true,
				label: {text: `Quit?`, side: 'left'},
				border: {
					type: 'line',
					fg: 'red'
				},
				style: {
					fg: 'white',
					bg: 'red',
				}
			});
		}
		
		this.quitDialog.key(['escape', 'n', 'enter', 'y', 'q'], ch => {
			switch (ch) {
				case 'q':
				case 'y': {
					this.destroy();
					console.log("Quit by user");
					process.exit(0);
					break;
				}
				default: {
					this.quitDialog.hide();
					this.screen.render();
				}
			}
		});
		
		this.quitDialog.focus();
		this.quitDialog.setLine(1, " Do you really want to quit? {grey-fg}(press y/n){/} ");
		
	}
	
	addView(name, viewClass) {
		const newView = new viewClass();
		this.screen.append(newView.element);
		this.views[name] = newView;
	}
	
	view(name) {
		return this.views[name];
	}
	
	render() {
		
		Object.getOwnPropertyNames(this.views).forEach(p => {
			this.views[p].update();
		});
		
		if(this.quitDialog){
			this.quitDialog.setFront();
		}
		this.screen.render();
	}
	
	destroy() {
		this.screen.destroy();
		this.views = {};
	}
}

module.exports = Scene;