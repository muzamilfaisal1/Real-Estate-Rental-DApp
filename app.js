let web3;
let accounts = [];

// Replace with your actual deployed contract addresses and ABIs after implementing on Remix
const leaseContractAddress = "0x9074c42E6805d250D9ec9b6FC398e66b78d1F504";
const leaseContractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tenant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_rent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deposit",
				"type": "uint256"
			}
		],
		"name": "createLease",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "leaseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "landlord",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tenant",
				"type": "address"
			}
		],
		"name": "LeaseCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "leaseId",
				"type": "uint256"
			}
		],
		"name": "LeaseTerminated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_leaseId",
				"type": "uint256"
			}
		],
		"name": "terminateLease",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getLeasesByUser",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "leaseCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "leases",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "landlord",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tenant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deposit",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userLeases",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const paymentContractAddress = "0xDC63cB79C15800C07aD8187F110C7D4D5d5FdE1B";
const paymentContractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_leaseId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_dueDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_paymentPeriod",
				"type": "string"
			}
		],
		"name": "createPaymentRequest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_paymentId",
				"type": "uint256"
			}
		],
		"name": "makePayment",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_leaseId",
				"type": "uint256"
			}
		],
		"name": "getPayments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "leaseId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "tenant",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "landlord",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dueDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "paidDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "platformFee",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "paymentPeriod",
						"type": "string"
					}
				],
				"internalType": "struct PaymentContract.Payment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const disputeContractAddress = "0xC602469C71d54437Aaa9b64c277eCEe37B73b0aA";
const disputeContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "disputeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "leaseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "DisputeFiled",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "disputeCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "disputes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "leaseId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "disputeType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "enum DisputeContract.DisputeStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_leaseId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_type",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			}
		],
		"name": "fileDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserDisputes",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_disputeId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_accept",
				"type": "bool"
			}
		],
		"name": "resolveDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userDisputes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const maintenanceContractAddress = "0x9d830e5a5F546F5179D65905422C537E319E0aFc";
const maintenanceContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "leaseId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "requester",
				"type": "address"
			}
		],
		"name": "MaintenanceRequested",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_leaseId",
				"type": "uint256"
			}
		],
		"name": "getLeaseRequests",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "leaseId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "requester",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "requestType",
						"type": "string"
					},
					{
						"internalType": "enum MaintenanceContract.Urgency",
						"name": "urgency",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct MaintenanceContract.Request[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserRequests",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "leaseRequests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "leaseId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "requester",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "requestType",
				"type": "string"
			},
			{
				"internalType": "enum MaintenanceContract.Urgency",
				"name": "urgency",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "requestCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_leaseId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_type",
				"type": "string"
			},
			{
				"internalType": "enum MaintenanceContract.Urgency",
				"name": "_urgency",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			}
		],
		"name": "requestMaintenance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userRequests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const ownershipContractAddress = "0x3412432d33c010bE962e73688AAe98b2495005f8";
const ownershipContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "PropertyRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserProperties",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "properties",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "propertyType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "size",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bedrooms",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bathrooms",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "propertyCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_type",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_size",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_bedrooms",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_bathrooms",
				"type": "uint256"
			}
		],
		"name": "registerProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userProperties",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let leaseContract, paymentContract, disputeContract, maintenanceContract, ownershipContract;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set the first tab as active by default
  showTab('lease');
  
  // Check if wallet was previously connected
  checkWalletConnection();
  
  // Add event listeners to all forms
  setupFormListeners();
});

// Connect wallet button event listener
document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);

// Function to connect to Ethereum wallet
async function connectWallet() {
  const connectionStatus = document.getElementById("connectionStatus");
  const walletAddressElement = document.getElementById("walletAddress");
  const connectButton = document.getElementById("connectWalletBtn");
  
  if (typeof window.ethereum !== "undefined") {
    try {
      // Show connecting status
      connectionStatus.textContent = "Connecting...";
      connectionStatus.className = "status pending";
      
      // Initialize Web3
      web3 = new Web3(window.ethereum);
      
      // Request account access
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const shortenedAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
      walletAddressElement.textContent = `Wallet: ${shortenedAddress}`;
      
      // Update connection status
      connectionStatus.textContent = "Connected";
      connectionStatus.className = "status active";
      connectButton.innerHTML = `<i class="fas fa-link"></i> Connected`;
      
      // Initialize contracts if addresses are provided
      initializeContracts();
      
      // Save connection state
      localStorage.setItem("walletConnected", "true");
      
      // Load user data
      loadUserData();
      
      return true;
    } catch (err) {
      console.error("Wallet connection error:", err);
      connectionStatus.textContent = "Connection Failed";
      connectionStatus.className = "status rejected";
      
      // Show appropriate error message
      if (err.code === 4001) {
        // User rejected the connection request
        showError("You rejected the connection request. Please approve the connection to use Havenly.");
      } else {
        showError("Failed to connect to your wallet. Please try again or check console for details.");
      }
      
      return false;
    }
  } else {
    connectionStatus.textContent = "No Wallet Detected";
    connectionStatus.className = "status rejected";
    showError("No Ethereum wallet detected. Please install MetaMask or another compatible wallet.", true);
    return false;
  }
}

// Function to check if wallet was previously connected
function checkWalletConnection() {
  if (localStorage.getItem("walletConnected") === "true" && typeof window.ethereum !== "undefined") {
    // Auto-connect if previously connected
    connectWallet();
  }
}

// Initialize smart contracts
function initializeContracts() {
  try {
    console.log("Initializing contracts...");
    console.log("Lease contract address:", leaseContractAddress);
    console.log("Lease contract ABI type:", typeof leaseContractABI, Array.isArray(leaseContractABI));
    console.log("Lease contract ABI length:", leaseContractABI ? leaseContractABI.length : 0);
    
    // Ensure ABIs are properly formatted as arrays
    const ensureArray = (abi) => Array.isArray(abi) ? abi : (typeof abi === 'string' ? JSON.parse(abi) : []);
    
    // Only initialize contracts if addresses are provided
    if (leaseContractAddress && leaseContractABI) {
      console.log("Creating lease contract instance...");
      const leaseABI = ensureArray(leaseContractABI);
      console.log("Processed lease ABI:", leaseABI.length, "items");
      leaseContract = new web3.eth.Contract(leaseABI, leaseContractAddress);
      console.log("Lease contract initialized:", leaseContract ? "Success" : "Failed");
    } else {
      console.log("Skipping lease contract initialization due to missing address or ABI");
    }
    
    if (paymentContractAddress && paymentContractABI) {
      console.log("Creating payment contract instance...");
      const paymentABI = ensureArray(paymentContractABI);
      console.log("Processed payment ABI:", paymentABI.length, "items");
      paymentContract = new web3.eth.Contract(paymentABI, paymentContractAddress);
      console.log("Payment contract initialized:", paymentContract ? "Success" : "Failed");
    } else {
      console.log("Skipping payment contract initialization due to missing address or ABI");
    }
    
    if (disputeContractAddress && disputeContractABI) {
      console.log("Creating dispute contract instance...");
      const disputeABI = ensureArray(disputeContractABI);
      console.log("Processed dispute ABI:", disputeABI.length, "items");
      disputeContract = new web3.eth.Contract(disputeABI, disputeContractAddress);
      console.log("Dispute contract initialized:", disputeContract ? "Success" : "Failed");
    } else {
      console.log("Skipping dispute contract initialization due to missing address or ABI");
    }
    
    if (maintenanceContractAddress && maintenanceContractABI) {
      console.log("Creating maintenance contract instance...");
      const maintenanceABI = ensureArray(maintenanceContractABI);
      console.log("Processed maintenance ABI:", maintenanceABI.length, "items");
      maintenanceContract = new web3.eth.Contract(maintenanceABI, maintenanceContractAddress);
      console.log("Maintenance contract initialized:", maintenanceContract ? "Success" : "Failed");
    } else {
      console.log("Skipping maintenance contract initialization due to missing address or ABI");
    }
    
    if (ownershipContractAddress && ownershipContractABI) {
      console.log("Creating ownership contract instance...");
      const ownershipABI = ensureArray(ownershipContractABI);
      console.log("Processed ownership ABI:", ownershipABI.length, "items");
      ownershipContract = new web3.eth.Contract(ownershipABI, ownershipContractAddress);
      console.log("Ownership contract initialized:", ownershipContract ? "Success" : "Failed");
    } else {
      console.log("Skipping ownership contract initialization due to missing address or ABI");
    }
    
    console.log("Contracts initialized successfully.");
  } catch (err) {
    console.error("Error initializing contracts:", err);
    showError("Failed to initialize smart contracts. Please check contract addresses and ABIs.");
  }
}

// Function to show the selected tab and update navigation
function showTab(tabId) {
  // Hide all tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.classList.remove("active"));
  
  // Show the selected tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add("active");
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll("nav button");
    navButtons.forEach(button => button.classList.remove("active"));
    
    // Add active class to the corresponding button
    const activeButton = document.getElementById(`${tabId}Btn`);
    if (activeButton) {
      activeButton.classList.add("active");
    }
    
    // Save the active tab in local storage
    localStorage.setItem("activeTab", tabId);
  }
}

// Function to load user data from blockchain
async function loadUserData() {
  if (!web3 || !accounts || accounts.length === 0) {
    console.log("Wallet not connected. Cannot load user data.");
    return;
  }
  
  try {
    console.log("Loading user data...");
    console.log("Lease contract exists:", !!leaseContract);
    console.log("Payment contract exists:", !!paymentContract);
    console.log("Dispute contract exists:", !!disputeContract);
    console.log("Maintenance contract exists:", !!maintenanceContract);
    console.log("Ownership contract exists:", !!ownershipContract);
    
    // Clear loading states
    document.querySelectorAll(".empty-state").forEach(element => {
      element.textContent = "Loading data...";
    });
    
    // Load data for each section if contracts are initialized
    if (leaseContract) {
      console.log("Loading lease data...");
      loadLeaseData();
    } else {
      console.log("Skipping lease data loading - contract not initialized");
    }
    
    if (paymentContract) {
      console.log("Loading payment data...");
      loadPaymentData();
    } else {
      console.log("Skipping payment data loading - contract not initialized");
    }
    
    if (disputeContract) {
      console.log("Loading dispute data...");
      loadDisputeData();
    } else {
      console.log("Skipping dispute data loading - contract not initialized");
    }
    
    if (maintenanceContract) {
      console.log("Loading maintenance data...");
      loadMaintenanceData();
    } else {
      console.log("Skipping maintenance data loading - contract not initialized");
    }
    
    if (ownershipContract) {
      console.log("Loading ownership data...");
      loadOwnershipData();
    } else {
      console.log("Skipping ownership data loading - contract not initialized");
    }
    
    // Check if user is admin and load admin data
    checkAdminStatus();
    
  } catch (err) {
    console.error("Error loading user data:", err);
    showError("Failed to load your data from the blockchain.");
  }
}

// Functions for loading data from contracts using Web3.js
async function loadLeaseData() {
  try {
    const leasesContainer = document.getElementById("activeLeases");
    leasesContainer.innerHTML = "<p class='loading'>Loading lease data...</p>";
    
    // Get leases associated with the connected user
    const leaseIds = await leaseContract.methods.getLeasesByUser(accounts[0]).call();
    
    if (leaseIds.length === 0) {
      leasesContainer.innerHTML = "<p class='empty-state'>You don't have any active leases.</p>";
      return;
    }
    
    let leasesHTML = '';
    
    // Fetch details for each lease
    for (const leaseId of leaseIds) {
      const lease = await leaseContract.methods.leases(leaseId).call();
      
      // Only show active leases
      if (lease.active) {
        const startDate = new Date(lease.startDate * 1000).toLocaleDateString();
        const endDate = new Date((Number(lease.startDate) + (Number(lease.duration) * 30 * 24 * 60 * 60)) * 1000).toLocaleDateString();
        const rentInEth = web3.utils.fromWei(lease.rent, 'ether');
        const depositInEth = web3.utils.fromWei(lease.deposit, 'ether');
        
        // Determine if user is landlord or tenant
        const role = lease.landlord.toLowerCase() === accounts[0].toLowerCase() ? 'Landlord' : 'Tenant';
        const otherParty = role === 'Landlord' ? lease.tenant : lease.landlord;
        
        leasesHTML += `
          <div class="lease-card">
            <div class="lease-header">
              <h4>Lease #${lease.id}</h4>
              <span class="role ${role.toLowerCase()}">${role}</span>
            </div>
            <div class="lease-details">
              <p><strong>Property ID:</strong> ${lease.propertyId}</p>
              <p><strong>${role === 'Landlord' ? 'Tenant' : 'Landlord'}:</strong> ${otherParty.substring(0, 6)}...${otherParty.substring(38)}</p>
              <p><strong>Period:</strong> ${startDate} to ${endDate}</p>
              <p><strong>Monthly Rent:</strong> ${rentInEth} ETH</p>
              <p><strong>Security Deposit:</strong> ${depositInEth} ETH</p>
            </div>
            <div class="lease-actions">
              <button class="view-details" onclick="viewLeaseDetails(${lease.id})">View Details</button>
              ${role === 'Landlord' ? `<button class="danger" onclick="terminateLease(${lease.id})">Terminate Lease</button>` : ''}
            </div>
          </div>
        `;
      }
    }
    
    if (leasesHTML === '') {
      leasesContainer.innerHTML = "<p class='empty-state'>You don't have any active leases.</p>";
    } else {
      leasesContainer.innerHTML = leasesHTML;
    }
  } catch (error) {
    console.error("Error loading lease data:", error);
    document.getElementById("activeLeases").innerHTML = 
      `<p class='error'>Error loading lease data: ${error.message}</p>`;
  }
}

async function loadPaymentData() {
  try {
    const paymentsContainer = document.getElementById("paymentHistory");
    paymentsContainer.innerHTML = "<p class='loading'>Loading payment data...</p>";
    
    // First, get user's leases to find payments
    const leaseIds = await leaseContract.methods.getLeasesByUser(accounts[0]).call();
    
    if (leaseIds.length === 0) {
      paymentsContainer.innerHTML = "<p class='empty-state'>No payment history found.</p>";
      return;
    }
    
    let paymentsHTML = '';
    let hasPayments = false;
    
    // For each lease, get payment history
    for (const leaseId of leaseIds) {
      const lease = await leaseContract.methods.leases(leaseId).call();
      const payments = await paymentContract.methods.getPayments(leaseId).call();
      
      if (payments.length > 0) {
        hasPayments = true;
        
        // Add lease header
        paymentsHTML += `
          <div class="payment-group">
            <h4>Lease #${leaseId} Payments</h4>
            <div class="payment-list">
        `;
        
        // Add each payment
        for (const payment of payments) {
          const date = new Date(payment.timestamp * 1000).toLocaleDateString();
          const amount = web3.utils.fromWei(payment.amount, 'ether');
          const isPayer = payment.payer.toLowerCase() === accounts[0].toLowerCase();
          
          paymentsHTML += `
            <div class="payment-item ${isPayer ? 'outgoing' : 'incoming'}">
              <div class="payment-info">
                <span class="payment-date">${date}</span>
                <span class="payment-period">${payment.period}</span>
                <span class="payment-amount">${amount} ETH</span>
              </div>
              <div class="payment-status">
                <span class="status-badge ${isPayer ? 'sent' : 'received'}">
                  ${isPayer ? 'Sent' : 'Received'}
                </span>
              </div>
            </div>
          `;
        }
        
        paymentsHTML += `
            </div>
          </div>
        `;
      }
    }
    
    if (!hasPayments) {
      paymentsContainer.innerHTML = "<p class='empty-state'>No payment history found.</p>";
    } else {
      paymentsContainer.innerHTML = paymentsHTML;
    }
  } catch (error) {
    console.error("Error loading payment data:", error);
    document.getElementById("paymentHistory").innerHTML = 
      `<p class='error'>Error loading payment data: ${error.message}</p>`;
  }
}

async function loadDisputeData() {
  try {
    const disputesContainer = document.getElementById("myDisputes");
    disputesContainer.innerHTML = "<p class='loading'>Loading dispute data...</p>";
    
    // Get disputes associated with the connected user
    const disputeIds = await disputeContract.methods.getUserDisputes(accounts[0]).call();
    
    if (disputeIds.length === 0) {
      disputesContainer.innerHTML = "<p class='empty-state'>You don't have any disputes.</p>";
      return;
    }
    
    let disputesHTML = '';
    
    // Fetch details for each dispute
    for (const disputeId of disputeIds) {
      const dispute = await disputeContract.methods.disputes(disputeId).call();
      
      // Get lease details for context
      const lease = await leaseContract.methods.leases(dispute.leaseId).call();
      
      // Format dispute status
      let statusClass = '';
      let statusText = '';
      
      switch (Number(dispute.status)) {
        case 0:
          statusClass = 'pending';
          statusText = 'Pending';
          break;
        case 1:
          statusClass = 'resolved';
          statusText = 'Resolved';
          break;
        case 2:
          statusClass = 'rejected';
          statusText = 'Rejected';
          break;
      }
      
      const date = new Date(dispute.timestamp * 1000).toLocaleDateString();
      
      disputesHTML += `
        <div class="dispute-card">
          <div class="dispute-header">
            <h4>Dispute #${dispute.id}</h4>
            <span class="status ${statusClass}">${statusText}</span>
          </div>
          <div class="dispute-details">
            <p><strong>Lease ID:</strong> ${dispute.leaseId}</p>
            <p><strong>Type:</strong> ${dispute.disputeType}</p>
            <p><strong>Filed on:</strong> ${date}</p>
            <p><strong>Description:</strong> ${dispute.description}</p>
          </div>
        </div>
      `;
    }
    
    disputesContainer.innerHTML = disputesHTML;
  } catch (error) {
    console.error("Error loading dispute data:", error);
    document.getElementById("myDisputes").innerHTML = 
      `<p class='error'>Error loading dispute data: ${error.message}</p>`;
  }
}

async function loadMaintenanceData() {
  if (!checkWalletConnected()) return;
  
  try {
    const maintenanceRequestsDiv = document.getElementById("myMaintenanceRequests");
    if (!maintenanceRequestsDiv) return;
    
    // Get user's maintenance requests
    const userRequestIds = await maintenanceContract.methods.getUserRequests(accounts[0]).call();
    
    if (userRequestIds.length === 0) {
      maintenanceRequestsDiv.innerHTML = '<p class="empty-state">No maintenance requests found</p>';
      return;
    }
    
    // Get all leases for the user
    const userLeases = await leaseContract.methods.getLeasesByUser(accounts[0]).call();
    
    // Get maintenance requests for each lease
    let allRequests = [];
    for (const leaseId of userLeases) {
      const leaseRequests = await maintenanceContract.methods.getLeaseRequests(leaseId).call();
      allRequests = allRequests.concat(leaseRequests);
    }
    
    // Sort requests by timestamp (newest first)
    allRequests.sort((a, b) => b.timestamp - a.timestamp);
    
    // Create HTML for each request
    const requestsHTML = allRequests.map(request => {
      const urgencyText = ['Low', 'Medium', 'High', 'Emergency'][request.urgency];
      const urgencyClass = ['low', 'medium', 'high', 'emergency'][request.urgency];
      const date = new Date(request.timestamp * 1000).toLocaleDateString();
      
      return `
        <div class="request-card">
          <div class="request-header">
            <h4>Request #${request.id}</h4>
            <span class="urgency ${urgencyClass}">${urgencyText}</span>
          </div>
          <p><strong>Lease ID:</strong> ${request.leaseId}</p>
          <p><strong>Type:</strong> ${request.requestType}</p>
          <p><strong>Description:</strong> ${request.description}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Status:</strong> ${request.status || 'Pending'}</p>
        </div>
      `;
    }).join('');
    
    maintenanceRequestsDiv.innerHTML = requestsHTML;
  } catch (error) {
    console.error("Error loading maintenance data:", error);
    document.getElementById("myMaintenanceRequests").innerHTML = 
      `<p class='error'>Error loading maintenance data: ${error.message}</p>`;
  }
}

async function loadOwnershipData() {
  try {
    const propertiesContainer = document.getElementById("myProperties");
    propertiesContainer.innerHTML = "<p class='loading'>Loading property data...</p>";
    
    // Get properties owned by the connected user
    const propertyIds = await ownershipContract.methods.getUserProperties(accounts[0]).call();
    
    if (propertyIds.length === 0) {
      propertiesContainer.innerHTML = "<p class='empty-state'>You don't have any registered properties.</p>";
      return;
    }
    
    let propertiesHTML = '';
    
    // Fetch details for each property
    for (const propertyId of propertyIds) {
      const property = await ownershipContract.methods.properties(propertyId).call();
      
      propertiesHTML += `
        <div class="property-card">
          <div class="property-header">
            <h4>${property.propertyType}</h4>
            <span class="property-id">ID: ${property.id}</span>
          </div>
          <div class="property-details">
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Size:</strong> ${property.size} sq ft</p>
            <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
            <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
          </div>
          <div class="property-actions">
            <button class="success" onclick="createLeaseForProperty(${property.id})">Create Lease</button>
            <button onclick="viewPropertyDetails(${property.id})">View Details</button>
          </div>
        </div>
      `;
    }
    
    propertiesContainer.innerHTML = propertiesHTML;
  } catch (error) {
    console.error("Error loading property data:", error);
    document.getElementById("myProperties").innerHTML = 
      `<p class='error'>Error loading property data: ${error.message}</p>`;
  }
}

async function checkAdminStatus() {
  try {
    // First check if all required contracts are initialized
    if (!leaseContract || !ownershipContract || !disputeContract || !maintenanceContract) {
      throw new Error("One or more contracts are not initialized. Please ensure you're connected to the correct network.");
    }

    // Get total number of leases
    let leaseCount = 0;
    try {
      leaseCount = await leaseContract.methods.leaseCounter().call();
      document.getElementById("totalLeases").textContent = leaseCount;
    } catch (err) {
      console.error("Error getting lease count:", err);
      document.getElementById("totalLeases").textContent = "Error";
    }
    
    // Get total number of properties
    let propertyCount = 0;
    try {
      propertyCount = await ownershipContract.methods.propertyCounter().call();
      document.getElementById("totalProperties").textContent = propertyCount;
    } catch (err) {
      console.error("Error getting property count:", err);
      document.getElementById("totalProperties").textContent = "Error";
    }
    
    // Get total number of users (unique addresses from leases and properties)
    const uniqueUsers = new Set();
    
    try {
      // Add users from leases
      for (let i = 0; i < leaseCount; i++) {
        try {
          const lease = await leaseContract.methods.leases(i).call();
          if (lease.landlord) uniqueUsers.add(lease.landlord.toLowerCase());
          if (lease.tenant) uniqueUsers.add(lease.tenant.toLowerCase());
        } catch (err) {
          console.error(`Error getting lease ${i}:`, err);
          continue;
        }
      }
      
      // Add property owners
      for (let i = 0; i < propertyCount; i++) {
        try {
          const property = await ownershipContract.methods.properties(i).call();
          if (property.owner) uniqueUsers.add(property.owner.toLowerCase());
        } catch (err) {
          console.error(`Error getting property ${i}:`, err);
          continue;
        }
      }
      
      document.getElementById("totalUsers").textContent = uniqueUsers.size;
    } catch (err) {
      console.error("Error calculating unique users:", err);
      document.getElementById("totalUsers").textContent = "Error";
    }
    
    // Calculate total volume in ETH
    try {
      let totalVolume = web3.utils.toBN('0');
      for (let i = 0; i < leaseCount; i++) {
        try {
          const lease = await leaseContract.methods.leases(i).call();
          if (lease.rent) totalVolume = totalVolume.add(web3.utils.toBN(lease.rent));
          if (lease.deposit) totalVolume = totalVolume.add(web3.utils.toBN(lease.deposit));
        } catch (err) {
          console.error(`Error getting lease ${i} for volume calculation:`, err);
          continue;
        }
      }
      document.getElementById("totalVolume").textContent = web3.utils.fromWei(totalVolume, 'ether');
    } catch (err) {
      console.error("Error calculating total volume:", err);
      document.getElementById("totalVolume").textContent = "Error";
    }
    
    // Get pending disputes
    const pendingDisputes = [];
    try {
      const disputeCount = await disputeContract.methods.disputeCounter().call();
      for (let i = 0; i < disputeCount; i++) {
        try {
          const dispute = await disputeContract.methods.disputes(i).call();
          if (Number(dispute.status) === 0) { // 0 = Open/Pending
            pendingDisputes.push(dispute);
          }
        } catch (err) {
          console.error(`Error getting dispute ${i}:`, err);
          continue;
        }
      }
    } catch (err) {
      console.error("Error getting disputes:", err);
    }

    // Get pending maintenance requests
    const pendingMaintenance = [];
    try {
      const maintenanceCount = await maintenanceContract.methods.requestCounter().call();
      const leaseCount = await leaseContract.methods.leaseCounter().call();
      
      // Get all maintenance requests for each lease
      for (let j = 0; j < leaseCount; j++) {
        try {
          const requests = await maintenanceContract.methods.getLeaseRequests(j).call();
          for (const request of requests) {
            if (!request.status || Number(request.status) === 0) { // 0 = Pending
              pendingMaintenance.push(request);
            }
          }
        } catch (err) {
          console.error(`Error getting maintenance requests for lease ${j}:`, err);
          continue;
        }
      }
    } catch (err) {
      console.error("Error getting maintenance requests:", err);
    }

    // Display pending approvals
    const pendingApprovalsDiv = document.getElementById("pendingApprovals");
    let approvalsHTML = '<div class="pending-approvals-container">';

    // Display pending disputes
    if (pendingDisputes.length > 0) {
      approvalsHTML += `
        <div class="pending-section">
          <h3>Pending Disputes</h3>
          ${pendingDisputes.map(dispute => `
            <div class="approval-card">
              <p><strong>Dispute ID:</strong> ${dispute.id}</p>
              <p><strong>Lease ID:</strong> ${dispute.leaseId}</p>
              <p><strong>Type:</strong> ${dispute.disputeType}</p>
              <p><strong>Description:</strong> ${dispute.description}</p>
              <div class="approval-actions">
                <button onclick="approveDispute(${dispute.id}, true)" class="approve-btn">Approve</button>
                <button onclick="approveDispute(${dispute.id}, false)" class="reject-btn">Reject</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Display pending maintenance requests
    if (pendingMaintenance.length > 0) {
      approvalsHTML += `
        <div class="pending-section">
          <h3>Pending Maintenance Requests</h3>
          ${pendingMaintenance.map(request => `
            <div class="approval-card">
              <p><strong>Request ID:</strong> ${request.id}</p>
              <p><strong>Lease ID:</strong> ${request.leaseId}</p>
              <p><strong>Type:</strong> ${request.requestType}</p>
              <p><strong>Urgency:</strong> ${['Low', 'Medium', 'High', 'Emergency'][request.urgency]}</p>
              <p><strong>Description:</strong> ${request.description}</p>
              <div class="approval-actions">
                <button onclick="approveMaintenance(${request.id})" class="approve-btn">Approve</button>
                <button onclick="rejectMaintenance(${request.id})" class="reject-btn">Reject</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (pendingDisputes.length === 0 && pendingMaintenance.length === 0) {
      approvalsHTML += '<p class="empty-state">No pending approvals at this time.</p>';
    }

    approvalsHTML += '</div>';
    pendingApprovalsDiv.innerHTML = approvalsHTML;

  } catch (error) {
    console.error("Error checking admin status:", error);
    document.getElementById("pendingApprovals").innerHTML = 
      `<p class='error'>Error loading admin data: ${error.message}. Please ensure you're connected to the correct network and have the right permissions.</p>`;
    
    // Also update other stats to show error state
    document.getElementById("totalLeases").textContent = "Error";
    document.getElementById("totalProperties").textContent = "Error";
    document.getElementById("totalUsers").textContent = "Error";
    document.getElementById("totalVolume").textContent = "Error";
  }
}

// Add these new functions to handle approvals
async function approveDispute(disputeId, approve) {
  if (!checkWalletConnected()) return;
  
  try {
    const result = await disputeContract.methods.resolveDispute(disputeId, approve)
      .send({ from: accounts[0] });
    
    showMessage(`Dispute ${approve ? 'approved' : 'rejected'} successfully!`);
    checkAdminStatus(); // Refresh the admin view
  } catch (error) {
    console.error("Error resolving dispute:", error);
    showError(`Error resolving dispute: ${error.message}`);
  }
}

async function approveMaintenance(requestId) {
  if (!checkWalletConnected()) return;
  
  try {
    const result = await maintenanceContract.methods.approveRequest(requestId)
      .send({ from: accounts[0] });
    
    showMessage("Maintenance request approved successfully!");
    checkAdminStatus(); // Refresh the admin view
  } catch (error) {
    console.error("Error approving maintenance request:", error);
    showError(`Error approving maintenance request: ${error.message}`);
  }
}

async function rejectMaintenance(requestId) {
  if (!checkWalletConnected()) return;
  
  try {
    const result = await maintenanceContract.methods.rejectRequest(requestId)
      .send({ from: accounts[0] });
    
    showMessage("Maintenance request rejected successfully!");
    checkAdminStatus(); // Refresh the admin view
  } catch (error) {
    console.error("Error rejecting maintenance request:", error);
    showError(`Error rejecting maintenance request: ${error.message}`);
  }
}

// Setup form listeners
function setupFormListeners() {
  // Lease creation form
  const createLeaseForm = document.getElementById("createLeaseForm");
  if (createLeaseForm) {
    createLeaseForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      
      if (!checkWalletConnected()) return;
      
      try {
        const propertyId = document.getElementById("propertyId").value;
        const tenant = document.getElementById("tenantAddress").value;
        const startDate = Math.floor(new Date(document.getElementById("leaseStart").value).getTime() / 1000);
        const duration = parseInt(document.getElementById("leaseDuration").value);
        const rent = web3.utils.toWei(document.getElementById("monthlyRent").value, "ether");
        const deposit = web3.utils.toWei(document.getElementById("securityDeposit").value, "ether");
        
        // Validate inputs
        if (!propertyId || !tenant || !startDate || !duration || !rent || !deposit) {
          showError("Please fill in all fields");
          return;
        }
        
        // Check if tenant address is valid
        if (!web3.utils.isAddress(tenant)) {
          showError("Invalid tenant address");
          return;
        }
        
        // Create the lease
        const result = await leaseContract.methods.createLease(
          tenant,
          startDate,
          duration,
          rent,
          deposit
        ).send({ from: accounts[0] });
        
        // Get the new lease ID from the event
        const leaseId = result.events.LeaseCreated.returnValues.leaseId;
        
        showMessage("Lease created successfully!");
        document.getElementById("createLeaseForm").reset();
        
        // Automatically assign the lease ID to other forms
        await assignLeaseId(leaseId);
        
        // Reload lease data to show the new lease
        loadLeaseData();
      } catch (error) {
        console.error("Error creating lease:", error);
        showError(`Error creating lease: ${error.message}`);
      }
    });
  }

  // Payment form
  const makePaymentForm = document.getElementById("makePaymentForm");
  if (makePaymentForm) {
    makePaymentForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      
      if (!checkWalletConnected()) return;
      
      try {
        const leaseId = parseInt(document.getElementById("paymentLeaseId").value);
        const amount = web3.utils.toWei(document.getElementById("paymentAmount").value, "ether");
        const period = document.getElementById("paymentPeriod").value;
        
        // Validate inputs
        if (isNaN(leaseId) || !amount || !period) {
          showError("Please fill in all fields with valid values");
          return;
        }

        // Get lease details to determine if user is landlord or tenant
        const lease = await leaseContract.methods.leases(leaseId).call();
        const isLandlord = lease.landlord.toLowerCase() === accounts[0].toLowerCase();
        const isTenant = lease.tenant.toLowerCase() === accounts[0].toLowerCase();

        if (!isLandlord && !isTenant) {
          showError("You are not authorized to make payments for this lease");
          return;
        }

        let result;
        if (isLandlord) {
          // Create payment request
          const dueDate = Math.floor(new Date(period + "-01").getTime() / 1000);
          result = await paymentContract.methods.createPaymentRequest(
            leaseId,
            dueDate,
            period
          ).send({ from: accounts[0] });
          
          // Get the payment ID from the event
          const paymentId = result.events.PaymentCreated.returnValues.paymentId;
          showMessage(`Payment request created successfully! Payment ID: ${paymentId}`);
        } else {
          // Get pending payments for this lease
          const payments = await paymentContract.methods.getPayments(leaseId).call();
          const pendingPayment = payments.find(p => p.status === "0" && p.tenant.toLowerCase() === accounts[0].toLowerCase());
          
          if (!pendingPayment) {
            showError("No pending payment found for this lease");
            return;
          }

          // Make payment
          result = await paymentContract.methods.makePayment(
            pendingPayment.id
          ).send({ from: accounts[0], value: pendingPayment.amount });
          
          showMessage("Payment made successfully!");
        }
        
        document.getElementById("makePaymentForm").reset();
        
        // Reload payment data to show the new payment
        loadPaymentData();
      } catch (error) {
        console.error("Error processing payment:", error);
        showError(`Error processing payment: ${error.message}`);
      }
    });
  }

  // Dispute form
  const fileDisputeForm = document.getElementById("fileDisputeForm");
  if (fileDisputeForm) {
    fileDisputeForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      
      if (!checkWalletConnected()) return;
      
      try {
        const leaseId = parseInt(document.getElementById("disputeLeaseId").value);
        const disputeType = document.getElementById("disputeType").value;
        const description = document.getElementById("disputeDescription").value;
        
        // Validate inputs
        if (isNaN(leaseId) || !disputeType || !description) {
          showError("Please fill in all fields with valid values");
          return;
        }
        
        // File the dispute
        const result = await disputeContract.methods.fileDispute(
          leaseId,
          disputeType,
          description
        ).send({ from: accounts[0] });
        
        showMessage("Dispute filed successfully!");
        document.getElementById("fileDisputeForm").reset();
        
        // Reload dispute data to show the new dispute
        loadDisputeData();
      } catch (error) {
        console.error("Error filing dispute:", error);
        showError(`Error filing dispute: ${error.message}`);
      }
    });
  }

  // Maintenance form
  const maintenanceRequestForm = document.getElementById("maintenanceRequestForm");
  if (maintenanceRequestForm) {
    maintenanceRequestForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      
      if (!checkWalletConnected()) return;
      
      try {
        const leaseId = parseInt(document.getElementById("maintenanceLeaseId").value);
        const maintenanceType = document.getElementById("maintenanceType").value;
        const urgencyValue = document.getElementById("maintenanceUrgency").value;
        const description = document.getElementById("maintenanceDescription").value;
        
        // Convert urgency string to enum value
        let urgency;
        switch(urgencyValue) {
          case 'low':
            urgency = 0; // Urgency.Low
            break;
          case 'medium':
            urgency = 1; // Urgency.Medium
            break;
          case 'high':
            urgency = 2; // Urgency.High
            break;
          case 'emergency':
            urgency = 3; // Urgency.Emergency
            break;
          default:
            throw new Error("Invalid urgency level");
        }
        
        // Validate inputs
        if (isNaN(leaseId) || !maintenanceType || urgency === undefined || !description) {
          showError("Please fill in all fields with valid values");
          return;
        }
        
        // Request maintenance
        const result = await maintenanceContract.methods.requestMaintenance(
          leaseId,
          maintenanceType,
          urgency,
          description
        ).send({ from: accounts[0] });
        
        showMessage("Maintenance request submitted successfully!");
        document.getElementById("maintenanceRequestForm").reset();
        
        // Reload maintenance data to show the new request
        loadMaintenanceData();
      } catch (error) {
        console.error("Error requesting maintenance:", error);
        showError(`Error requesting maintenance: ${error.message}`);
      }
    });
  }

  // Property registration form
  const registerPropertyForm = document.getElementById("registerPropertyForm");
  if (registerPropertyForm) {
    registerPropertyForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      
      if (!checkWalletConnected()) return;
      
      try {
        const location = document.getElementById("propertyAddress").value;
        const propertyType = document.getElementById("propertyType").value;
        const bedrooms = parseInt(document.getElementById("propertyBedrooms").value);
        const bathrooms = parseFloat(document.getElementById("propertyBathrooms").value);
        const size = parseInt(document.getElementById("propertySize").value);
        
        // Validate inputs
        if (!location || !propertyType || isNaN(bedrooms) || isNaN(bathrooms) || isNaN(size)) {
          showError("Please fill in all required fields with valid values");
          return;
        }
        
        // Register the property
        const result = await ownershipContract.methods.registerProperty(
          location,
          propertyType,
          size,
          bedrooms,
          bathrooms
        ).send({ from: accounts[0] });
        
        showMessage("Property registered successfully!");
        document.getElementById("registerPropertyForm").reset();
        
        // Reload ownership data to show the new property
        loadOwnershipData();
      } catch (error) {
        console.error("Error registering property:", error);
        showError(`Error registering property: ${error.message}`);
      }
    });
  }

  // Admin settings form
  const adminSettingsForm = document.getElementById("adminSettingsForm");
  if (adminSettingsForm) {
    adminSettingsForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      
      if (!checkWalletConnected()) return;
      
      // This is a placeholder for admin settings
      // In a real implementation, you might have a separate admin contract
      showMessage("Admin settings updated (placeholder)");
    });
  }
  
  // Setup action buttons for the displayed data
  setupActionListeners();
}

// Helper function to check if wallet is connected
async function checkWalletConnected() {
  if (!web3 || !accounts || accounts.length === 0) {
    showError("Please connect your wallet first.");
    return false;
  }
  return true;
}

// Function to show error messages
function showError(message, isWalletError = false) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  if (isWalletError) {
    errorDiv.innerHTML += ` <a href="https://metamask.io/download.html" target="_blank">Install MetaMask</a>`;
  }
  
  document.body.appendChild(errorDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.classList.add("fade-out");
    setTimeout(() => errorDiv.remove(), 500);
  }, 5000);
}

// Function to show informational messages
function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  
  let icon = "info-circle";
  if (type === "success") icon = "check-circle";
  if (type === "warning") icon = "exclamation-triangle";
  
  messageDiv.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  document.body.appendChild(messageDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageDiv.classList.add("fade-out");
    setTimeout(() => messageDiv.remove(), 500);
  }, 5000);
}

// Setup action listeners for the displayed data
function setupActionListeners() {
  // These listeners will be attached to buttons that are dynamically created
  // when loading data from the contracts
  
  // Lease detail view
  document.addEventListener('click', async function(event) {
    // View lease details
    if (event.target.classList.contains('view-lease-btn')) {
      const leaseId = event.target.getAttribute('data-id');
      await viewLeaseDetails(leaseId);
    }
    
    // Terminate lease
    if (event.target.classList.contains('terminate-lease-btn')) {
      const leaseId = event.target.getAttribute('data-id');
      await terminateLease(leaseId);
    }
    
    // View property details
    if (event.target.classList.contains('view-property-btn')) {
      const propertyId = event.target.getAttribute('data-id');
      await viewPropertyDetails(propertyId);
    }
    
    // Create lease for property
    if (event.target.classList.contains('create-lease-btn')) {
      const propertyId = event.target.getAttribute('data-id');
      createLeaseForProperty(propertyId);
    }
    
    // Resolve dispute
    if (event.target.classList.contains('resolve-dispute-btn')) {
      const disputeId = event.target.getAttribute('data-id');
      await resolveDispute(disputeId);
    }
    
    // Complete maintenance
    if (event.target.classList.contains('complete-maintenance-btn')) {
      const requestId = event.target.getAttribute('data-id');
      await completeMaintenance(requestId);
    }
  });
}

// Function to view lease details
async function viewLeaseDetails(leaseId) {
  if (!checkWalletConnected()) return;
  
  try {
    const lease = await leaseContract.methods.leases(leaseId).call();
    
    // Create a modal or popup to display lease details
    const detailsHTML = `
      <div class="modal-content">
        <h3>Lease Details</h3>
        <p><strong>Lease ID:</strong> ${leaseId}</p>
        <p><strong>Property ID:</strong> ${lease.propertyId}</p>
        <p><strong>Landlord:</strong> ${lease.landlord}</p>
        <p><strong>Tenant:</strong> ${lease.tenant}</p>
        <p><strong>Start Date:</strong> ${new Date(lease.startDate * 1000).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${new Date(lease.endDate * 1000).toLocaleDateString()}</p>
        <p><strong>Rent Amount:</strong> ${web3.utils.fromWei(lease.rentAmount, 'ether')} ETH</p>
        <p><strong>Status:</strong> ${lease.active ? 'Active' : 'Inactive'}</p>
      </div>
    `;
    
    // Display the details in a modal
    const detailsModal = document.getElementById('detailsModal');
    if (detailsModal) {
      detailsModal.innerHTML = detailsHTML;
      detailsModal.style.display = 'block';
      
      // Add close button functionality
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.className = 'btn';
      closeBtn.onclick = function() {
        detailsModal.style.display = 'none';
      };
      detailsModal.querySelector('.modal-content').appendChild(closeBtn);
    } else {
      // If no modal exists, show in an alert (not ideal but works as fallback)
      alert(`Lease Details:\nID: ${leaseId}\nProperty: ${lease.propertyId}\nTenant: ${lease.tenant}\nDates: ${new Date(lease.startDate * 1000).toLocaleDateString()} to ${new Date(lease.endDate * 1000).toLocaleDateString()}\nRent: ${web3.utils.fromWei(lease.rentAmount, 'ether')} ETH`);
    }
  } catch (error) {
    console.error("Error viewing lease details:", error);
    showError(`Error viewing lease details: ${error.message}`);
  }
}

// Function to terminate a lease
async function terminateLease(leaseId) {
  if (!checkWalletConnected()) return;
  
  try {
    // Confirm before terminating
    if (!confirm(`Are you sure you want to terminate lease #${leaseId}?`)) {
      return;
    }
    
    // Call the contract method to terminate the lease
    const result = await leaseContract.methods.terminateLease(leaseId)
      .send({ from: accounts[0] });
    
    showMessage(`Lease #${leaseId} terminated successfully!`);
    
    // Reload lease data to reflect the change
    loadLeaseData();
  } catch (error) {
    console.error("Error terminating lease:", error);
    showError(`Error terminating lease: ${error.message}`);
  }
}

// Function to view property details
async function viewPropertyDetails(propertyId) {
  if (!checkWalletConnected()) return;
  
  try {
    const property = await ownershipContract.methods.properties(propertyId).call();
    
    // Create a modal or popup to display property details
    const detailsHTML = `
      <div class="modal-content">
        <h3>Property Details</h3>
        <p><strong>Property ID:</strong> ${propertyId}</p>
        <p><strong>Owner:</strong> ${property.owner}</p>
        <p><strong>Address:</strong> ${property.location}</p>
        <p><strong>Type:</strong> ${property.propertyType}</p>
        <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
      </div>
    `;
    
    // Display the details in a modal
    const detailsModal = document.getElementById('detailsModal');
    if (detailsModal) {
      detailsModal.innerHTML = detailsHTML;
      detailsModal.style.display = 'block';
      
      // Add close button functionality
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.className = 'btn';
      closeBtn.onclick = function() {
        detailsModal.style.display = 'none';
      };
      detailsModal.querySelector('.modal-content').appendChild(closeBtn);
      
      // Add create lease button if user is the owner
      if (property.owner.toLowerCase() === accounts[0].toLowerCase()) {
        const createLeaseBtn = document.createElement('button');
        createLeaseBtn.textContent = 'Create Lease';
        createLeaseBtn.className = 'btn create-lease-btn';
        createLeaseBtn.setAttribute('data-id', propertyId);
        detailsModal.querySelector('.modal-content').appendChild(createLeaseBtn);
      }
    } else {
      // If no modal exists, show in an alert (not ideal but works as fallback)
      alert(`Property Details:\nID: ${propertyId}\nAddress: ${property.location}\nType: ${property.propertyType}\nBedrooms: ${property.bedrooms}\nBathrooms: ${property.bathrooms}`);
    }
  } catch (error) {
    console.error("Error viewing property details:", error);
    showError(`Error viewing property details: ${error.message}`);
  }
}

// Function to pre-fill the create lease form for a specific property
function createLeaseForProperty(propertyId) {
  // Show the lease tab
  showTab('lease');
  
  // Pre-fill the property ID field
  document.getElementById('propertyId').value = propertyId;
  
  // Focus on the tenant field
  document.getElementById('tenantAddress').focus();
}

// Function to resolve a dispute
async function resolveDispute(disputeId) {
  if (!checkWalletConnected()) return;
  
  try {
    // Confirm before resolving
    if (!confirm(`Are you sure you want to resolve dispute #${disputeId}?`)) {
      return;
    }
    
    // Get resolution details
    const resolution = prompt("Enter resolution details:");
    if (!resolution) return;
    
    // Call the contract method to resolve the dispute
    const result = await disputeContract.methods.resolveDispute(disputeId, resolution)
      .send({ from: accounts[0] });
    
    showMessage(`Dispute #${disputeId} resolved successfully!`);
    
    // Reload dispute data to reflect the change
    loadDisputeData();
  } catch (error) {
    console.error("Error resolving dispute:", error);
    showError(`Error resolving dispute: ${error.message}`);
  }
}

// Function to complete a maintenance request
async function completeMaintenance(requestId) {
  if (!checkWalletConnected()) return;
  
  try {
    // Confirm before completing
    if (!confirm(`Are you sure you want to mark maintenance request #${requestId} as completed?`)) {
      return;
    }
    
    // Call the contract method to complete the maintenance request
    // Note: This assumes there's a completeRequest method in the contract
    const result = await maintenanceContract.methods.completeRequest(requestId)
      .send({ from: accounts[0] });
    
    showMessage(`Maintenance request #${requestId} marked as completed!`);
    
    // Reload maintenance data to reflect the change
    loadMaintenanceData();
  } catch (error) {
    console.error("Error completing maintenance request:", error);
    showError(`Error completing maintenance request: ${error.message}`);
  }
}

// Function to automatically assign lease ID after lease creation
async function assignLeaseId(leaseId) {
  // Update payment form
  const paymentLeaseId = document.getElementById("paymentLeaseId");
  if (paymentLeaseId) {
    paymentLeaseId.value = leaseId;
  }
  
  // Update dispute form
  const disputeLeaseId = document.getElementById("disputeLeaseId");
  if (disputeLeaseId) {
    disputeLeaseId.value = leaseId;
  }
  
  // Update maintenance form
  const maintenanceLeaseId = document.getElementById("maintenanceLeaseId");
  if (maintenanceLeaseId) {
    maintenanceLeaseId.value = leaseId;
  }
}
