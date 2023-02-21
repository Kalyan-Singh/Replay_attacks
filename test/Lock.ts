import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import {Signer,BigNumber} from "ethers";

import {UGT__factory,UGT,MESH__factory,MESH} from "../typechain-types"



let signers:Signer[]
let alice:Signer;
let bob:Signer;
let proxy:Signer;

let ugt: UGT;
let mesh: MESH;



describe("VerifyTesting",()=>{

  beforeEach(async ()=>{
     signers= await ethers.getSigners();
     alice= signers[0];
     bob= signers[1];
     proxy=signers[2];
     ugt= await new UGT__factory(alice).deploy(10000000000);
    mesh= await new MESH__factory(alice).deploy(10000000000);
    await expect(ugt.connect(alice).enableTransfer(true)).to.not.be.reverted;
    await expect(mesh.connect(alice).enableTransfer(true)).to.not.be.reverted;
    await expect((await mesh.connect(alice).disableLock(false))).to.not.be.reverted;
  });

  it('Tests',async ()=>{
    let from = await alice.getAddress();
    let to = await bob.getAddress();
    let value = 100;
    let fee=3;
    // let msg= await ethers.utils.solidityKeccak256(["address","address","uint"],[from,to,value]);
    // let msg=await ethers.utils.hashMessage(from,to,value);
    // let msg= await ethers.utils.keccak256()
    let msg= await mesh.hashMessage(from,to,value,fee,0);
    console.log("message",msg);
    let provider= new ethers.providers.JsonRpcProvider()
    let sig=await alice.signMessage(msg);
    let r= sig.slice(0,66);
    let s='0x'+sig.slice(66,130);
    let vs=sig.slice(130,132);
    console.log(sig);
    console.log(r,s);

    let v=parseInt(vs,16);
    console.log(v);
    // the proxy service call the transferProxy function on behalf of alice for 3 token fee.

    console.log( await mesh.transferEnabled())

    await expect(mesh.connect(proxy).transferProxy(from,to,value,3,v,r,s)).to.be.revertedWith("afhasjd");

    // await expect(mesh.connect(proxy).balanceOf(await proxy.getAddress())).to.equal(BigNumber.from("3"));

  })
}

)