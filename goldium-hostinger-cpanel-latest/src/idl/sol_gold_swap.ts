import { Idl } from '@coral-xyz/anchor';

export const SWAP_IDL: Idl = {
  "version": "0.1.0",
  "name": "sol_gold_swap",
  "instructions": [
    {
      "name": "initializePool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenBMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenBVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "feeRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minimumAmountOut",
          "type": "u64"
        },
        {
          "name": "swapDirection",
          "type": "bool"
        }
      ]
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountA",
          "type": "u64"
        },
        {
          "name": "amountB",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeLiquidity",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "liquidityAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "SwapPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tokenAMint",
            "type": "publicKey"
          },
          {
            "name": "tokenBMint",
            "type": "publicKey"
          },
          {
            "name": "tokenAVault",
            "type": "publicKey"
          },
          {
            "name": "tokenBVault",
            "type": "publicKey"
          },
          {
            "name": "feeRate",
            "type": "u64"
          },
          {
            "name": "totalLiquidity",
            "type": "u64"
          },
          {
            "name": "reserveA",
            "type": "u64"
          },
          {
            "name": "reserveB",
            "type": "u64"
          },
          {
            "name": "totalSwaps",
            "type": "u64"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapDirection",
          "type": "bool",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidityEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amountA",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountB",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAmount",
      "msg": "Invalid amount provided"
    },
    {
      "code": 6001,
      "name": "InsufficientLiquidity",
      "msg": "Insufficient liquidity in pool"
    },
    {
      "code": 6002,
      "name": "SlippageExceeded",
      "msg": "Slippage tolerance exceeded"
    },
    {
      "code": 6003,
      "name": "InvalidFeeRate",
      "msg": "Invalid fee rate"
    },
    {
      "code": 6004,
      "name": "PoolNotInitialized",
      "msg": "Pool not initialized"
    },
    {
      "code": 6005,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    }
  ]
};

export type SolGoldSwap = {
  "version": "0.1.0";
  "name": "sol_gold_swap";
  "instructions": [
    {
      "name": "initializePool";
      "accounts": [
        {
          "name": "pool";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "tokenAMint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "tokenBMint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "tokenAVault";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "tokenBVault";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "authority";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "rent";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "feeRate";
          "type": "u64";
        }
      ];
    },
    {
      "name": "swap";
      "accounts": [
        {
          "name": "pool";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "userTokenAccountA";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "userTokenAccountB";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "poolTokenAccountA";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "poolTokenAccountB";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "user";
          "isMut": false;
          "isSigner": true;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "amountIn";
          "type": "u64";
        },
        {
          "name": "minimumAmountOut";
          "type": "u64";
        },
        {
          "name": "swapDirection";
          "type": "bool";
        }
      ];
    }
  ];
  "accounts": [
    {
      "name": "swapPool";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "authority";
            "type": "publicKey";
          },
          {
            "name": "tokenAMint";
            "type": "publicKey";
          },
          {
            "name": "tokenBMint";
            "type": "publicKey";
          },
          {
            "name": "tokenAVault";
            "type": "publicKey";
          },
          {
            "name": "tokenBVault";
            "type": "publicKey";
          },
          {
            "name": "feeRate";
            "type": "u64";
          },
          {
            "name": "totalLiquidity";
            "type": "u64";
          },
          {
            "name": "reserveA";
            "type": "u64";
          },
          {
            "name": "reserveB";
            "type": "u64";
          },
          {
            "name": "totalSwaps";
            "type": "u64";
          },
          {
            "name": "totalVolume";
            "type": "u64";
          },
          {
            "name": "bump";
            "type": "u8";
          }
        ];
      };
    }
  ];
  "events": [
    {
      "name": "SwapEvent";
      "fields": [
        {
          "name": "user";
          "type": "publicKey";
          "index": false;
        },
        {
          "name": "amountIn";
          "type": "u64";
          "index": false;
        },
        {
          "name": "amountOut";
          "type": "u64";
          "index": false;
        },
        {
          "name": "swapDirection";
          "type": "bool";
          "index": false;
        },
        {
          "name": "timestamp";
          "type": "i64";
          "index": false;
        }
      ];
    }
  ];
  "errors": [
    {
      "code": 6000;
      "name": "InvalidAmount";
      "msg": "Invalid amount provided";
    },
    {
      "code": 6001;
      "name": "InsufficientLiquidity";
      "msg": "Insufficient liquidity in pool";
    },
    {
      "code": 6002;
      "name": "SlippageExceeded";
      "msg": "Slippage tolerance exceeded";
    }
  ];
};