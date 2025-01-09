const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = 'Name is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    if (!data.phone?.trim()) errors.phone = 'Phone is required';
    if (!data.region || data.region === 'All Regions') errors.region = 'Please select a region';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email';
    }

    // const phoneRegex = /^\d+$/;
    // const minLength = 7;
    // const maxLength = 15;
    // if (data.phone && (!phoneRegex.test(data.phone) || data.phone.length < minLength || data.phone.length > maxLength)) {
    //     errors.phone = `Please enter a valid phone number (between ${minLength} and ${maxLength} digits)`;
    // }

    if (data.profilePicture && data.profilePicture.size > 5 * 1024 * 1024) {
      errors.profilePicture = 'Image must be less than 5MB';
    }

    return errors;
  };

  export default validateForm;