function validateForm() {
    const requiredFields = document.querySelectorAll("input[required]");
    let allFilled = true;

    requiredFields.forEach(field => {
      if (field.value.trim() === "") {
        allFilled = false;
      }
    });
  
    if(allFilled) {
        event.preventDefault();
        fetchAndDisplayData();
    }
  }