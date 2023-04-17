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

## Releases
<table>
<thead>
  <tr>
    <th>Version</th>
    <th>Format</th>
    <th>Compiled Platform</th>
    <th>SHA-256 Checksum</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td rowspan="3">0.1.0-alpha.1</td>
    <td>Windows MSI</td>
    <td>Windows 10</td>
    <td>930D1172EED5DEE03D419EADCBA6589D54CE0A99793B8408ABE5993292F631BC</td>
  </tr>
  <tr>
    <td>Linux deb</td>
    <td>Debian 11 (bullseye)</td>
    <td>608CF1165D9B2991BFC8C78F1171E827E86EEAEBE3148B5D1533A00698E58C3A</td>
  </tr>
  <tr>
    <td>Linux AppImage</td>
    <td>Debian 11 (bullseye)</td>
    <td>7F1BDD77452A441E43B090EEE4719FA294DAFA9305045DB5F93B638B06BB5CDB</td>
  </tr>
</tbody>
</table>





