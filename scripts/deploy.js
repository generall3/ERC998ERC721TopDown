import {ethers} from "hardhat";

async function main() {
    const ERC998ERC721TopDown = await ethers.getContractFactory("ERC998ERC721TopDown");
    const erc998erc721topdown = await ERC998ERC721TopDown.deploy();

    await gtn.deployed();

    console.log("ERC998ERC721TopDown Deployed to: ", erc998erc721topdown.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
