pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import {Simp} from "../src/Simp.sol";
import {SigUtils} from "./SigUtils.sol";

contract SimpTest is Test {
    event TTSDonated(address indexed simp, string message, uint amount);
    event Donated(address indexed simp, uint indexed merchId, uint amount);
    event Refunded(address indexed simp, uint indexed merchId, uint amount);
    event ReleaseApproved(address approver, uint merchId);
    event RefundApproved(address approver, uint merchId);
    event MerchChanged(uint indexed merchId, string name, string imageURI, uint _target, uint _expiry);
    event ModChanged(address[] approvers, address mod, bool isPromoted);
    event ThresholdUpdated(address[] approvers, uint newThreshold);

    Simp public simp;
    SigUtils public sigUtils;
    address queen = vm.addr(1337);
    uint mod1Key = 1;
    uint mod2Key = 2;
    uint mod3Key = 3;
    address mod1 = vm.addr(mod1Key); // address = 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
    address mod2 = vm.addr(mod2Key); // address = 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF
    address mod3 = vm.addr(mod3Key); // address = 0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69
    address simp1 = vm.addr(31337);
    address rando = vm.addr(7331);
    address[] mods = [mod1, mod2, mod3];
    uint merchLength = 10;
    

    function setUp() public {
        vm.deal(address(this), 100 ether);
        vm.deal(simp1, 100 ether);
        vm.deal(queen, 100 ether);
        vm.deal(mod1, 100 ether);
        vm.deal(mod2, 100 ether);
        vm.deal(mod3, 100 ether);

        simp = new Simp(queen, mods);

        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("Simp")), 
                keccak256(bytes("1")),
                block.chainid,
                simp
            )
        );
        sigUtils = new SigUtils(domainSeparator);
        vm.startPrank(queen);
        for (uint i = 0; i < merchLength; ++i) {
            simp.createMerch(
                "Test Merch Second",
                "test.com/image",
                500,
                block.timestamp + 1 days
            );
        }
        vm.stopPrank();

        // set up merchs for test
    }

    function testDonate() public {
        vm.expectEmit(true, true, false, true, address(simp));
        emit Donated(address(this), 0, 100);

        simp.donate{value: 100}(0);
        (, , , uint amount, ) = simp.merchs(0);
        assertEq(amount, 100, "amount in merch not updated");
        assertEq(simp.donatedAmount(0, address(this)), 100, "donator amount not updated");
    }

    function testDonateTTS() public {
        vm.expectEmit(true, false, false, true, address(simp));
        emit TTSDonated(address(this), unicode"🎉", 100);

        simp.donateTTS{value: 100}(unicode"🎉");
    }

    function testReleaseFund() public {
        vm.deal(queen, 0);
        simp.donate{value: 1000}(0);

        vm.expectEmit(false, false, false, true, address(simp));
        emit ReleaseApproved(mod1, 0);

        vm.startPrank(mod1);
        simp.releaseFund(0);
        vm.stopPrank();
        assertEq(queen.balance, 1000, "ether not transferred to queen");
    }

    function testReleaseFund_InvalidAddress() public {
        vm.startPrank(address(0));
        vm.expectRevert();
        simp.releaseFund(0);
        vm.stopPrank();
    }

    function testApproveRefund() public {
        vm.deal(queen, 0);
        simp.donate{value: 1000}(0);

        vm.expectEmit(false, false, false, true, address(simp));
        emit RefundApproved(mod1, 0);

        vm.startPrank(mod1);
        simp.approveRefund(0);
        vm.stopPrank();
        simp.refund(0, payable(simp1));
    }

    function testApproveFund_InvalidAddress() public {
        vm.startPrank(address(0));
        vm.expectRevert();
        simp.approveRefund(0);
        vm.stopPrank();
    }

    function testRefund() public {
        vm.deal(simp1, 1 ether);
        vm.prank(simp1); // donate as simp1
        simp.donate{value: 1000}(0);
        vm.prank(queen);
        simp.approveRefund(0);
        vm.deal(simp1, 0); // reset simp balance
        vm.expectEmit(true, true, false, true, address(simp));
        emit Refunded(simp1, 0, 1000);

        simp.refund(0, payable(simp1));
        assertEq(simp1.balance, 1000, "ether not refunded");
    }

    function testRefund_ReleasedRefund() public {
        vm.prank(simp1); // donate as simp1
        simp.donate{value: 1000}(0);
        vm.prank(mod1);
        simp.releaseFund(0);
        vm.expectRevert();
        simp.refund(0, payable(simp1));
    }

    function testRefund_InvalidAddress() public {
        vm.expectRevert();
        simp.refund(0, payable(address(0)));
    }

    function testRefund_DoubleRefund() public {
        vm.prank(simp1); // donate as simp1
        simp.donate{value: 1000}(0);
        vm.prank(mod1);
        simp.approveRefund(0);
        simp.refund(0, payable(simp1));
        vm.expectRevert();
        simp.refund(0, payable(simp1));
    }

    function testRefund_MultipleRefund() public {
        vm.prank(simp1); // donate as simp1
        simp.donate{value: 1000}(0);
        vm.prank(mod1); // donate as mod1
        simp.donate{value: 1000}(0);
        vm.prank(mod2);
        simp.approveRefund(0);
        vm.deal(mod1, 0);
        vm.deal(simp1, 0);
        simp.refund(0, payable(simp1));
        simp.refund(0, payable(mod1));
        assertEq(mod1.balance, 1000, "Donation not refunded");
        assertEq(simp1.balance, 1000, "Donation not refunded");
    }

    function testRefund_NoDonationRefund() public {
        vm.expectRevert();
        simp.refund(0, payable(rando));
    }

    function testCreateMerch() public {
        string memory name = "The valley";
        string memory image = "onion";
        uint target = 1 ether;
        uint amount = 0;
        uint time = block.timestamp + 1 weeks;

        vm.startPrank(mod1);
        vm.expectEmit(true, false, false, true, address(simp));
        emit MerchChanged(merchLength, name, image, target, time);

        uint index = simp.createMerch(name, image, target, time);
        vm.stopPrank();

        (string memory name_, string memory image_, uint target_, uint amount_, uint time_) = simp.merchs(index);
        assertEq(
            keccak256(abi.encode(name, image, target, amount, time)),
            keccak256(abi.encode(name_, image_, target_, amount_, time_)),
            "Merch properties not set correctly"
        );
    }

    function testUpdateMerch() public {
        string memory name = "The valley";
        string memory image = "onion";
        uint target = 1 ether;
        uint amount = 0;
        uint time = block.timestamp + 1 weeks;

        vm.startPrank(queen);
        vm.expectEmit(true, false, false, true, address(simp));
        emit MerchChanged(0, name, image, target, time);

        simp.updateMerch(0, name, image, target, time);
        vm.stopPrank();

        (string memory name_, string memory image_, uint target_, uint amount_, uint time_) = simp.merchs(0);
        assertEq(
            keccak256(abi.encode(name, image, target, amount, time)),
            keccak256(abi.encode(name_, image_, target_, amount_, time_)),
            "Merch properties not set correctly"
        );
    }

    function testAbdicate() public {
        vm.prank(queen);
        simp.abdicate(rando);
        assertEq(rando, simp.queen(), "queen should be changed");
    }

    // mod 2 < mod 3 < mod 1
    function testPromoteMod() public {
        uint deadline = block.timestamp + 1 days;
        bytes32 digest = sigUtils.getTypedDataHashPromoteMod(rando, deadline);
        Simp.Signature[] memory sigs = new Simp.Signature[](2);
        (sigs[1].v, sigs[1].r, sigs[1].s) = vm.sign(mod1Key, digest);
        (sigs[0].v, sigs[0].r, sigs[0].s) = vm.sign(mod2Key, digest);
        sigs[0].signer = mod2;
        sigs[1].signer = mod1;
        
        simp.promoteMod(rando, deadline, sigs);
        assertTrue(simp.isMod(rando), "Not promoted to mod");
    }

    function testPromoteMod_InvalidAddress() public {
        uint deadline = block.timestamp + 1 days;
        Simp.Signature[] memory sigs = new Simp.Signature[](2);
        
        vm.expectRevert();
        simp.promoteMod(rando, deadline, sigs);
    }

    function testDemoteMod() public {
        uint deadline = block.timestamp + 1 days;
        bytes32 digest = sigUtils.getTypedDataHashDemoteMod(mod3, deadline);
        Simp.Signature[] memory sigs = new Simp.Signature[](2);
        (sigs[1].v, sigs[1].r, sigs[1].s) = vm.sign(mod1Key, digest);
        (sigs[0].v, sigs[0].r, sigs[0].s) = vm.sign(mod2Key, digest);
        sigs[0].signer = mod2;
        sigs[1].signer = mod1;
        
        simp.demoteMod(mod3, deadline, sigs);
        assertFalse(simp.isMod(mod3), "Mod not demoted");
    }

    function testUpdateThreshold() public {
        uint threshold = 3;
        uint deadline = block.timestamp + 1 days;
        bytes32 digest = sigUtils.getTypedDataHashThreshold(threshold, deadline);
        Simp.Signature[] memory sigs = new Simp.Signature[](2);
        (sigs[1].v, sigs[1].r, sigs[1].s) = vm.sign(mod1Key, digest);
        (sigs[0].v, sigs[0].r, sigs[0].s) = vm.sign(mod2Key, digest);
        sigs[0].signer = mod2;
        sigs[1].signer = mod1;
        
        simp.updateModThreshold(threshold, deadline, sigs);
        assertEq(simp.modThreshold(), threshold, "Threshold not changed");
    }

    function testMerchCount() public {
        assertEq(simp.merchCount(), merchLength, "Wrong merch count");
    }

    function testDonatedAmount() public {
        simp.donate{value: 100}(0);
        assertEq(simp.donatedAmount(0, address(this)), 100, "Wrong donated amount");
    }
}