pragma solidity ^0.8.18;

contract SigUtils {
    bytes32 internal DOMAIN_SEPARATOR;

    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    bytes32 public constant UPDATE_THRESHOLD_TYPED_HASH =
        keccak256("UpdateModThreshold(uint256 _threshold,uint256 _deadline)");

    bytes32 public constant DEMOTE_MOD_TYPED_HASH =
        keccak256("DemoteMod(address _mod,uint256 _deadline)");

    bytes32 public constant PROMOTE_MOD_TYPED_HASH =
        keccak256("PromoteMod(address _mod,uint256 _deadline)");

    function getTypedDataHashPromoteMod(address _mod, uint _deadline) public view returns (bytes32) {
        bytes32 hashStruct = keccak256(
            abi.encode(
                PROMOTE_MOD_TYPED_HASH,
                _mod,
                _deadline
            )
        );

        return keccak256(abi.encodePacked(
            uint16(0x1901),
            DOMAIN_SEPARATOR,
            hashStruct
        ));
    }

    function getTypedDataHashDemoteMod(address _mod, uint _deadline) public view returns (bytes32) {
        bytes32 hashStruct = keccak256(
            abi.encode(
                DEMOTE_MOD_TYPED_HASH,
                _mod,
                _deadline
            )
        );

        return keccak256(abi.encodePacked(
            uint16(0x1901),
            DOMAIN_SEPARATOR,
            hashStruct
        ));
    }

    function getTypedDataHashThreshold(uint _threshold, uint _deadline) public view returns (bytes32) {
        bytes32 hashStruct = keccak256(
            abi.encode(
                UPDATE_THRESHOLD_TYPED_HASH,
                _threshold,
                _deadline
            )
        );

        return keccak256(abi.encodePacked(
            uint16(0x1901),
            DOMAIN_SEPARATOR,
            hashStruct
        ));
    }
}