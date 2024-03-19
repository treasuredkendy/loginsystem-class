function validateRegistration(email, fullname, password, confirmPassword, date) {
    const errors = [];
  // hjh
    // Email validation (basic check)
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push("Invalid email format");
    }
  
    // Fullname validation (check if empty)
    if (!fullname || fullname.trim() === "") {
      errors.push("Full name cannot be empty");
    }
  
    // Password validation (length and symbol)
    if (!password || password.length < 8 || !/[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\]/.test(password)) {
      errors.push("Password must be at least 8 characters and contain at least one symbol");
    }
  
    // Confirm password validation (match with password)
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
  
    // Basic Date validation (check if empty and format)
    if (!date || !/\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push("Invalid date format (YYYY-MM-DD)");
    }
  
    return {
      success: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : "Validation successful",
    };
  }
  