// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {ParallelAuctions} from "../src/ParallelAuctions.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast(); // <-- CLI'dan gelen --private-key kullanılacak
        MockERC20 base = new MockERC20("DemoBase", "DBASE");
        ParallelAuctions auc = new ParallelAuctions();
        vm.stopBroadcast();

        console2.log("MockERC20:", address(base));
        console2.log("ParallelAuctions:", address(auc));
    }
}
