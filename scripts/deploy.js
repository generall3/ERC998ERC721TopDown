import {ethers} from "hardhat";

async function main() {
    const IERC998ERC721TopDown = await ethers.getContractFactory("IERC998ERC721TopDown");
    const ierc998erc721topdown = await IERC998ERC721TopDown.deploy();

    await gtn.deployed();

    console.log("IERC998ERC721TopDown Deployed to: ", ierc998erc721topdown.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });