<script setup>
// import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useDtrStore } from '@/stores/dtr';
import { useCurrentTime } from '@/layout/composables/useCurrentTIme'
import Employee from '@/components/Employee.vue';

const dtrStore = useDtrStore();
let earlybirds = ref(dtrStore.earlyBirds());
let nightowls = ref(dtrStore.nightOwls());

const logoUrl = computed(() => {
    return `layout/images/logo.png`;
});

const { currentTime } = useCurrentTime();
const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

var emp_number = ref('');
const placeholder = ref('');
const activeButton = ref('AM-IN'); // Keep track of the active button
var msg = ref('');

const timeIn = (period) => {
    placeholder.value = `Time In for ${period}`;
    activeButton.value = `${period}-IN`;
};

const timeOut = (period) => {
    placeholder.value = `Time Out for ${period}`;
    activeButton.value = `${period}-OUT`;
};

// Extracted the common logic to clear the dtrStore and other values
function clearData() {
  emp_number.value = '';
  msg.value = null;
  dtrStore.user_id = null;
  dtrStore.fullname = null;
  dtrStore.emp_number = null;
  dtrStore.date = null;
  dtrStore.inAM = null;
  dtrStore.outAM = null;
  dtrStore.inPM = null;
  dtrStore.outPM = null;
  dtrStore.ip = null;
}

async function submit() {
  try {
    let dtr;
    switch (activeButton.value) {
      case 'AM-IN':
        dtr = await dtrStore.TimeInAM(emp_number.value);
        msg.value = dtr ? 'Good Morning ' + dtrStore.fullname : 'Employee not found';
        break;
      case 'AM-OUT':
        dtr = await dtrStore.TimeOutAM(emp_number.value);
        msg.value = dtr ? 'Enjoy your lunch ' + dtrStore.fullname : 'Employee not found';
        break;
      case 'PM-IN':
        dtr = await dtrStore.TimeInPM(emp_number.value);
        msg.value = dtr ? 'Good Afternoon ' + dtrStore.fullname : 'Employee not found';
        break;
      case 'PM-OUT':
        dtr = await dtrStore.TimeOutPM(emp_number.value);
        msg.value = dtr ? 'Goodbye ' + dtrStore.fullname : 'Employee not found';
        break;
    }
    
    setTimeout(() => {
      clearData();
    }, 3000);

  } catch (error) {
    console.log('ERROR:', error);
    msg.value = 'Something went wrong';
  }
}

/*
async function submit1() {
    switch (activeButton.value) {
        case 'AM-IN': {
            try {
                // console.log(emp_number.value);
                let dtr = await dtrStore.TimeInAM(emp_number.value);
                if (dtr) {
                    msg.value = 'Good Morning ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                    // either redirect or hide login modal, dipende na use case
                    // console.log('Logged in!');
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                    // yan failed el login
                    // man alert lng nu? or reload. Yes puede tamen.
                    // nccta pa extension para na documentation?
                    // no need ya ata.
                    // console.log('Else but not logged in.');
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }

        case 'AM-OUT': {
            try {
                // console.log(emp_number.value);
                let dtr = await dtrStore.TimeOutAM(emp_number.value);
                if (dtr) {
                    msg.value = 'Enjoy your Lunch ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }
        case 'PM-IN': {
            try {
                console.log(emp_number.value);
                let dtr = await dtrStore.TimeInPM(emp_number.value);
                if (dtr) {
                    msg.value = 'Good Afternoon ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }
        case 'PM-OUT': {
            try {
                console.log(emp_number.value);
                let dtr = await dtrStore.TimeOutPM(emp_number.value);
                if (dtr) {
                    msg.value = 'Good bye ' + dtrStore.fullname;
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                } else {
                    msg.value = 'Employee not found';
                    setTimeout(() => {
                        emp_number.value = '';
                        msg.value = null;
                        dtrStore.user_id = null;
                        dtrStore.fullname = null;
                        dtrStore.emp_number = null;
                        dtrStore.date = null;
                        dtrStore.inAM = null;
                        dtrStore.outAM = null;
                        dtrStore.inPM = null;
                        dtrStore.outPM = null;
                        dtrStore.ip = null;
                    }, 3000);
                }
            } catch (error) {
                console.log('ERROR:', error);
            }
            break;
        }
        default:
    }
}
*/
</script>

<template>
  <div class="row ml-2 mr-2">
    <div class="card col-5">
            <h4>Present</h4>
            <h5>Early Birds</h5>

            <Employee v-for="bird in dtrStore.earlybirds" :employee="bird" :key="bird.user_id" />

            <h5>Night Owls</h5>
            <Employee v-for="owl in dtrStore.nightowls" :employee="owl" :key="owl.user_id" />
    </div>

    <div class="card col-7">
    <!-- <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"> -->
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="DOST-IX Logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(2, 81, 145, 0) 75%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                  <div v-if="msg" class="w-full text-center font-semibold bg-cyan-400 text-white text-2xl mb-3 p-3 border-2">
                    {{ msg }}
                  </div>
                  <div v-if="!msg" class="w-full text-center font-semibold text-2xl mb-3 p-3">&nbsp;</div>
                    <InputText id="emp_number" v-model="emp_number" type="text" :placeholder="placeholder" class="w-full md:w-50rem mb-4 text-center" style="padding: 1.5rem" @keyup.enter="submit" />
                    <div class="row">
                      <span class="p-buttonset am-group">
                          <Button @click="timeIn('AM')" :class="{ active: activeButton === 'AM-IN' }" label="AM Time In" icon="pi pi-sign-in" />
                          <Button @click="timeOut('AM')" :class="{ active: activeButton === 'AM-OUT' }" label="AM Time Out" icon="pi pi-sign-out" />
                      </span>
                      <span class="p-buttonset pm-group p-2">
                          <Button @click="timeIn('PM')" :class="{ active: activeButton === 'PM-IN' }" label="PM Time In" icon="pi pi-sign-in" />
                          <Button @click="timeOut('PM')" :class="{ active: activeButton === 'PM-OUT' }" label="PM Time Out" icon="pi pi-sign-out" />
                      </span>
                    </div>
                    <p class="font-bold text-blue-700 text-8xl text-center font-semibold">
                        {{ currentTime.toLocaleTimeString() }}
                    </p>
                    <p class="border-4 border-indigo-500/100 text-center text-blue-700 text-6xl font-bold -mt-6">
                        {{ currentTime.toLocaleDateString('en-US', formatOptions) }}
                    </p>
                  </div>
            </div>
        </div>
    <!-- </div> -->
    </div>
    <AppConfig simple />
  </div>
</template>

<style scoped>
#clock {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.fixed-width {
    width: 400px;
    /* Adjust to your desired width */
}

.active {
    background-color: #ffd700;
    /* Gold color for active status */
    color: #000;
}

.p-buttonset .p-button:hover,
.p-buttonset .p-button.active {
    background-color: #ffd700;
    /* Gold color for active status and hover */
    color: #000;
}

.row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap; /* Prevent items from wrapping into multiple lines */
    margin-top: -10px;
    margin-bottom: -25px;
    padding-left: 5px;
}

/* If you'd like to put some space between the InputText and the button groups */
.row > * {
    margin: 0 10px; /* This will add 10px margin to left and right of all direct children of .row */
}

/* You might want to update the width of InputText for better alignment */
.w-full.md\:w-50rem {
    width: calc(100% - 250px); /* Full width minus space occupied by buttons */
}
</style>
