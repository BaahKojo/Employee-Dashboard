document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const employeeForm = document.getElementById('employeeForm');
    const employeeTableBody = document.getElementById('employeeTableBody');
    const emptyTableMessage = document.getElementById('emptyTableMessage');
    const successMessage = document.getElementById('successMessage');
    const clearFormButton = document.getElementById('clearForm');

    // Form input elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const positionInput = document.getElementById('position');
    const departmentInput = document.getElementById('department');
    const salaryInput = document.getElementById('salary');

    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const positionError = document.getElementById('positionError');
    const departmentError = document.getElementById('departmentError');
    const salaryError = document.getElementById('salaryError');

    // Employee data (in-memory only, no localStorage)
    let employees = [];
    let editIndex = -1; // Track if we're editing an employee

    // Form submission
    employeeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            const employee = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                position: positionInput.value,
                department: departmentInput.value,
                salary: salaryInput.value
            };

            if (editIndex === -1) {
                // Add new employee
                employees.push(employee);
                showSuccessMessage('Employee added successfully!');
            } else {
                // Update existing employee
                employees[editIndex] = employee;
                showSuccessMessage('Employee updated successfully!');
                editIndex = -1; // Reset edit mode
            }

            updateEmployeeTable();
            resetForm();
        }
    });

    // Clear form button
    clearFormButton.addEventListener('click', function() {
        resetForm();
        editIndex = -1;
    });

    // Form validation
    const validateForm = () => {
        let isValid = true;

        // Name validation
        if (nameInput.value.trim().length < 2) {
            showError(nameError, 'Please enter a valid name (min 2 characters)');
            isValid = false;
        } else {
            hideError(nameError);
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailError, 'Please enter a valid email address');
            isValid = false;
        } else {
            hideError(emailError);
        }

        // Position validation
        if (positionInput.value === '') {
            showError(positionError, 'Please select a position');
            isValid = false;
        } else {
            hideError(positionError);
        }

        // Department validation
        if (departmentInput.value === '') {
            showError(departmentError, 'Please select a department');
            isValid = false;
        } else {
            hideError(departmentError);
        }

        // Salary validation
        if (salaryInput.value === '' || parseInt(salaryInput.value) < 1000) {
            showError(salaryError, 'Please enter a valid salary (min GH¢1000)');
            isValid = false;
        } else {
            hideError(salaryError);
        }

        return isValid;
    }

    // Show error message
    const showError = (errorElement, message) => {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Hide error message
    const hideError = (errorElement) => {
        errorElement.style.display = 'none';
    }

    // Reset form
    const resetForm = () => {
        employeeForm.reset();
        hideAllErrors();
        document.querySelector('.btn').textContent = 'Add Employee';
        document.querySelector('.form-header h2').textContent = 'Add Employee';
    }

    // Hide all error messages
    const hideAllErrors = () => {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => {
            error.style.display = 'none';
        });
    }

    // Show success message
    const showSuccessMessage = (message) => {
        successMessage.textContent = message;
        successMessage.style.display = 'block';

        // Hide message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    // Update employee table
    const updateEmployeeTable = () => {
        employeeTableBody.innerHTML = '';

        if (employees.length === 0) {
            emptyTableMessage.style.display = 'block';
            return;
        }

        emptyTableMessage.style.display = 'none';

        employees.forEach((employee, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                        <td>${employee.name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.position}</td>
                        <td>${employee.department}</td>
                        <td>GH¢${parseInt(employee.salary).toLocaleString()}</td>
                        <td class="actions">
                            <button class="edit-btn" data-index="${index}">Edit</button>
                            <button class="delete-btn" data-index="${index}">Delete</button>
                        </td>
                    `;

            employeeTableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editEmployee(index);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteEmployee(index);
            });
        });
    }

    // Edit employee
    const editEmployee = (index) => {
        const employee = employees[index];

        // Fill form with employee data
        nameInput.value = employee.name;
        emailInput.value = employee.email;
        positionInput.value = employee.position;
        departmentInput.value = employee.department;
        salaryInput.value = employee.salary;

        // Change form to edit mode
        editIndex = index;
        document.querySelector('.btn').textContent = 'Update Employee';
        document.querySelector('.form-header h2').textContent = 'Edit Employee';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Delete employee
    const deleteEmployee = (index) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            employees.splice(index, 1);
            updateEmployeeTable();
            showSuccessMessage('Employee deleted successfully!');

            // If we were editing this employee, reset the form
            if (editIndex === index) {
                resetForm();
            }
        }
    }

    // Initialize the table
    updateEmployeeTable();
});