const { createApp } = Vue;

const appConfig = {
  data() {
    return {
      userData: {
        fullName: '',
        birthDate: '',
        genderSelect: '',
        totalGuests: '',
        kidsCount: '',
        lodging: '',
        cardName: '',
        cardNum: '',
        expDate: '',
        securityCode: ''
      },
      formErrors: {},
      mainError: '',
      attractions: [],
      fetchingData: false,
      fetchError: '',
      chosenAttractions: [],
      lodgingChoices: [
        'No accommodation needed',
        'Forest View Hotel',
        'Totoro Family Inn',
        'Witch Valley Guesthouse',
        'Luxury Ghibli Resort'
      ],
      isSummaryVisible: false
    };
  },
  mounted() {
    this.fetchAttractionsData();
  },
  methods: {
    async fetchAttractionsData() {
      this.fetchingData = true;
      this.fetchError = '';
      try {
        const response = await fetch('ghibli_park.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.attractions = data;
      } catch (err) {
        this.fetchError = 'Failed to load places. Please try again later.';
        console.error('Fetch error:', err);
      } finally {
        this.fetchingData = false;
      }
    },
    handleCardClick(item) {
      const idx = this.chosenAttractions.findIndex(attr => attr.id === item.id);
      if (idx > -1) {
        this.chosenAttractions.splice(idx, 1);
      } else {
        this.chosenAttractions.push(item);
      }
    },
    resetErrors() {
      this.formErrors = {};
      this.mainError = '';
      this.isSummaryVisible = false;
    },
    checkValidation() {
      let isFormValid = true;

      if (!this.userData.fullName.trim()) {
        this.formErrors.fullName = 'Full name is required.';
        isFormValid = false;
      }
      if (!this.userData.birthDate) {
        this.formErrors.birthDate = 'Date of birth is required.';
        isFormValid = false;
      }
      if (!this.userData.genderSelect) {
        this.formErrors.genderSelect = 'Gender is required.';
        isFormValid = false;
      }

      if (this.chosenAttractions.length === 0) {
        this.formErrors.chosenAttractions = 'Please select at least one Ghibli Park place.';
        isFormValid = false;
      }

      if (!this.userData.totalGuests || this.userData.totalGuests < 1) {
        this.formErrors.totalGuests = 'Total visitors must be at least 1.';
        isFormValid = false;
      }
      if (this.userData.kidsCount === '' || this.userData.kidsCount < 0) {
        this.formErrors.kidsCount = 'Number of children cannot be negative.';
        isFormValid = false;
      }
      if (parseInt(this.userData.kidsCount, 10) > parseInt(this.userData.totalGuests, 10)) {
        this.formErrors.kidsCount = 'Children cannot exceed total visitors.';
        isFormValid = false;
      }

      if (!this.userData.lodging) {
        this.formErrors.lodging = 'Accommodation selection is required.';
        isFormValid = false;
      }

      if (!this.userData.cardName.trim()) {
        this.formErrors.cardName = 'Name on card is required.';
        isFormValid = false;
      }
      if (!this.userData.cardNum.trim()) {
        this.formErrors.cardNum = 'Card number is required.';
        isFormValid = false;
      }
      if (!this.userData.expDate) {
        this.formErrors.expDate = 'Expiration date is required.';
        isFormValid = false;
      }
      if (!this.userData.securityCode.trim()) {
        this.formErrors.securityCode = 'CVC is required.';
        isFormValid = false;
      }

      return isFormValid;
    },
    submitForm() {
      this.resetErrors();
      
      const isFormValid = this.checkValidation();
      
      if (!isFormValid) {
        this.mainError = 'There are mandatory items pending to be filled. Please complete the required fields.'; 
      } else {
        this.isSummaryVisible = true;
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }, 150);
      }
    }
  }
};

createApp(appConfig).mount('#vue-app-container');