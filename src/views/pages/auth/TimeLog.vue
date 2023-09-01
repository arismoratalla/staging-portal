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

        if(!dtr){
          return false;
        }

        if (dtr.success) {
          msg.value = dtr.message
          await updateEarlyBirdsList();
          await updateNightOwlsList();
        }else{
          msg.value = dtr.message
        }

        break;
      case 'AM-OUT':
        dtr = await dtrStore.TimeOutAM(emp_number.value);

        if(!dtr){
          return false;
        }

        if (dtr.success) {
          msg.value = dtr.message
          await updateEarlyBirdsList();
          await updateNightOwlsList();
        }else{
          msg.value = dtr.message
        }
        break;
      case 'PM-IN':
        dtr = await dtrStore.TimeInPM(emp_number.value);

        if(!dtr){
          return false;
        }

        if (dtr.success) {
          msg.value = dtr.message
          await updateEarlyBirdsList();
          await updateNightOwlsList();
        }else{
          msg.value = dtr.message
        }
        break;
      case 'PM-OUT':
        dtr = await dtrStore.TimeOutPM(emp_number.value);

        if(!dtr){
          return false;
        }

        if (dtr.success) {
          msg.value = dtr.message
          await updateEarlyBirdsList();
          await updateNightOwlsList();
        }else{
          msg.value = dtr.message
        }
        break;
    }
    
    setTimeout(() => {
      clearData();
    }, 3000);

  } catch (error) {
    // console.log('ERROR:', error);
    msg.value = error;
  }
}

async function updateEarlyBirdsList() {
  try {
    earlybirds.value = await dtrStore.earlyBirds();
  } catch (error) {
    console.error('Could not update early birds:', error);
  }
}

async function updateNightOwlsList() {
  try {
    nightowls.value = await dtrStore.nightOwls();
  } catch (error) {
    console.error('Could not update night owls:', error);
  }
}

</script>

<template>
  <div class="container">
    <div class="employees">
        <h4>Present</h4>
        <h5>Early Birds</h5>

        <Employee v-for="bird in dtrStore.earlybirds" :employee="bird" :key="bird.user_id" />

        <h5>Night Owls</h5>
        <Employee v-for="owl in dtrStore.nightowls" :employee="owl" :key="owl.user_id" />
    </div>
    <div class="timelog flex flex-column align-items-center justify-content-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(0, 51, 92, 0) 75%)">
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
  </div>

    <!-- <AppConfig simple /> -->
</template>

<style scoped>
.container {
  display: flex;
  background-color: rgb(239, 243, 248);
}

.employees {
  width: 30%;
  height: 98vh;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  padding: 20px;
  text-align: left;

  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  background-color: rgb(204, 219, 245);
  text-align: left;  /* Overriding text alignment to left */
}

.timelog {
  width: 70%;
  height: 98vh;
  margin-right: 10px;
  margin-top: 10px;
  padding: 20px;
  text-align: center;

  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;

  background-color: rgb(220, 230, 248);
  text-align: left;  /* Overriding text alignment to left */
  /* background-color: rgb(255, 255, 255); */
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.active {
    background-color: #ffd700;
    color: #000;
}

.p-buttonset .p-button:hover,
.p-buttonset .p-button.active {
    background-color: #ffd700;
    color: #000;
}

#clock {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
/*
.fixed-width {
    width: 400px;
}



.row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    margin-top: -10px;
    margin-bottom: -25px;
    padding-left: 5px;
}
*/
/* If you'd like to put some space between the InputText and the button groups */
/* .row > * {
    margin: 0 10px;
} */

/* You might want to update the width of InputText for better alignment */
/* .w-full.md\:w-50rem {
    width: calc(100% - 250px);
} */
</style>
