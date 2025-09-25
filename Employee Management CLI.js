const readline = require("readline");

// Create interface for CLI input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Array to store employees
let employees = [];

// Function to show menu
function showMenu() {
  console.log("\n=== Employee Management System ===");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");
  rl.question("Enter your choice: ", handleMenu);
}

// Handle menu choices
function handleMenu(choice) {
  switch (choice.trim()) {
    case "1":
      addEmployee();
      break;
    case "2":
      listEmployees();
      break;
    case "3":
      removeEmployee();
      break;
    case "4":
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid choice! Try again.");
      showMenu();
  }
}

// Add employee
function addEmployee() {
  rl.question("Enter Employee ID: ", (id) => {
    if (!id.trim()) {
      console.log("ID cannot be empty!");
      return showMenu();
    }

    rl.question("Enter Employee Name: ", (name) => {
      if (!name.trim()) {
        console.log("Name cannot be empty!");
        return showMenu();
      }

      // Check for duplicate ID
      const exists = employees.find(emp => emp.id === id.trim());
      if (exists) {
        console.log("Employee with this ID already exists!");
        return showMenu();
      }

      employees.push({ id: id.trim(), name: name.trim() });
      console.log(`Employee ${name.trim()} added successfully.`);
      showMenu();
    });
  });
}

// List all employees
function listEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\n--- Employee List ---");
    employees.forEach(emp => console.log(`ID: ${emp.id}, Name: ${emp.name}`));
  }
  showMenu();
}

// Remove employee by ID
function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex(emp => emp.id === id.trim());
    if (index === -1) {
      console.log("Employee not found!");
    } else {
      const removed = employees.splice(index, 1);
      console.log(`Employee ${removed[0].name} removed successfully.`);
    }
    showMenu();
  });
}

// Start the application
showMenu();
