<div align="center">

# Catalyst

Catalyst is a simple add-on that enhances your SMPs and realms, allowing you to
quickly initiate scripting add-ons.

![commits](https://img.shields.io/github/commit-activity/t/vytdev/catalyst?style=flat)
![issues](https://img.shields.io/github/issues/vytdev/catalyst?style=flat)
![pull requests](https://img.shields.io/github/issues-pr/vytdev/catalyst?style=flat)
![contributors](https://img.shields.io/github/contributors/vytdev/catalyst?style=flat)
![version](https://img.shields.io/github/release/vytdev/catalyst?style=flat)
![license](https://img.shields.io/github/license/vytdev/catalyst?style=flat)
<br/>
![code size](https://img.shields.io/github/languages/code-size/vytdev/catalyst?style=flat)
![lines](https://tokei.rs/b1/github/vytdev/catalyst?category=lines&type=TypeScript,JavaScript&style=flat)
![codes](https://tokei.rs/b1/github/vytdev/catalyst?category=code&type=TypeScript,JavaScript&style=flat)
![comments](https://tokei.rs/b1/github/vytdev/catalyst?category=comments&type=TypeScript,JavaScript&style=flat)
![files](https://tokei.rs/b1/github/vytdev/catalyst?category=files&type=TypeScript,JavaScript&style=flat)

</div>

Hello there! Welcome to Catalyst &#x2014; a simple yet powerful Minecraft add-on
crafted to enhance your Minecraft SMPs/Realms experience and serve as a library
to kickstart your journey into developing scripting add-ons. It comes packed
with numerous functions and features for you to explore and enjoy!

> [!WARNING]
> This project is still in its early stages and relies on experimental script
> Beta APIs. Expect groundbreaking changes in the future.

*Catalyst is a remake of my old project, "Creators' API", featuring additional
functionalities and support for Minecraft 1.20.50+. You can see the old
project here: https://github.com/vytdev/creators-api*

#### Core features:

- Custom backslash commands
- Database storage API
- Custom events manager
- Minecraft "&#x00A7;" colors and formatting
- Minecraft built-in glyph icons
- Custom server forms UI
- Minimal logger
- Math helpers for Minecraft
- Plugin system
- Rawtext and target selector builder
- Server utilities
- Multi-threading support
- Tick utilities
- Simple server performance watchdog
- Other utility functions

#### Preset Plugins:

| Plugin | Description |
| :-: | :- |
| `chats` | Makes chat more interactive |
| `permissions` | Tag-based player permission manager |
| `speedometer` | In-game real-time speedometer |
| `utilities` | Server administration helper commands |

## Setup

Before you start, make sure you have the following software installed on your
computer:

- [Node.js](https://nodejs.org)
- [Git](https://git-scm.com)

Once you have these installed, follow these steps:

1. Open your terminal and clone the repository to your computer using the following
   command:

	```bash
	git clone https://github.com/vytdev/catalyst.git
	```

2. Change your current directory to the cloned repository:

	```bash
	cd catalyst
	```

3. Install the necessary components for the project:

	```bash
	npm install
	```

4. Start coding your server. Check out the examples provided in the 'src'
   folder to help you with your implementation.

5. Compile your server by executing the build script:

	```bash
	./build
	```

6. Once the compilation is finished, import the generated package into Minecraft.

7. Activate the imported package within your Minecraft world, and enable the
   Beta APIs experiment.

Congratulations! Your server is now ready and active in your Minecraft world!

## Contributing

Your contributions are greatly appreciated! Feel free to contribute to the
project's development:

1. Fork the repo
2. Create a new branch
3. Add your feature
4. Commit changes
5. Open a pull request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more
details!

*Don't forget to leave a star!*
