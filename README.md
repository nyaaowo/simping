# Simping
A crowdfunding smart contract and a web application to access it.

## Supported Platforms
Windows and Linux prebuilt binaries are provided. Theoretically you can build it with Tauri on MacOS and Android. It is a web application so you can always use it as a website or progressive web app.

## Build Instruction
The smart contract requires *foundry*.
The application requires *rust*, *tauri*, and *pnpm*. 

You can build it in the Debian devcontainer in vscode or locally on your machine. You need to install those dependencies if you build it locally.

1) Run `pnpm update` in `simp-ts` directory.
2) Fix typechain generated bindings not using `import type` in `simp-ts\src\lib\types\ethers-contract\factories\Simp__factory.ts` file. (Need to wait for typechain to fix it)
3) Run `pnpm tauri build` to generate binaries or `pnpm run build` to start it on localhost.

## Smart Contract
Tests are written for smart contract to ensure it works correctly (no time for frontend test 😭) and they also show estimated gas.

### Deployed Address
| Version | Chain | Address |
--- | --- | ---|
|0.1.0-alpha.1| Arbitrum Goerli| [0x6CE51f0A8B778C74F310d86a95a114d28C13A85e](https://goerli.arbiscan.io/address/0x6CE51f0A8B778C74F310d86a95a114d28C13A85e)|

## Known Issues
- Navigating while transaction is pending causes ui stacked page. Possible cause: Javascript is single-thread and the page is waiting for a promise, need to move it to the background





