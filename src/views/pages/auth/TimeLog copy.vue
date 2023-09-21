<script setup>
// import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted } from 'vue';
import DtrBirthdays from '@/layout/DtrBirthdays.vue';
import { useDtrStore } from '@/stores/dtr';
import { useCurrentTime } from '@/layout/composables/useCurrentTIme'
import Employee from '@/components/Employee.vue';

const clientIP = ref(null);
const isWhitelisted = ref(false);

const currentTwoWeeks = ref([]);
const selectedDay = ref(null);

onMounted(async () => {
  let today = new Date();
  // const offsetMinutes = today.getTimezoneOffset();  // Local to UTC
  // const offsetToTarget = -8 * 60;  // Target is GMT+8, so its offset to UTC is -8 hours
  // const totalOffset = offsetMinutes - offsetToTarget;  // Total offset from local to target time
  // const offsetMilliseconds = totalOffset * 60 * 1000;  // Convert total offset to milliseconds

  // today = new Date(today.getTime() - offsetMilliseconds);  // Adjust the date
  
  for (let i = 13; i >= 0; i--) {
    const pastDate = new Date(today);
    
    pastDate.setDate(today.getDate() - i); // Subtract days
    const dateStr = pastDate.toISOString().split('T')[0];
    const dayStr = pastDate.toLocaleDateString('en-US', { weekday: 'narrow' });
    currentTwoWeeks.value.push({ date: dateStr, day: dayStr });
  }
  console.log(currentTwoWeeks);
  const selectedDateStr = today.toISOString().split('T')[0];
  selectedDay.value = selectedDateStr;

  try {
    // Fetch client IP
    const resIp = await fetch('https://api.ipify.org?format=json');
    const dataIp = await resIp.json();
    clientIP.value = dataIp.ip;

    // Fetch whitelisted IPs from server
    const resWhitelist = await fetch('https://node-server.dost9.ph/api/auth/getWhitelistedIps');
    const dataWhitelist = await resWhitelist.json();
    const ipWhitelist = dataWhitelist.whitelistedIps;

    isWhitelisted.value = ipWhitelist.includes(clientIP.value);
  } catch (error) {
    console.error('Could not fetch data:', error);
  }
});

const dtrStore = useDtrStore();
let earlybirds = ref(dtrStore.earlyBirds());
let nightowls = ref(dtrStore.nightOwls());

const logoUrl = computed(() => {
    return `layout/images/logo.png`;
});

const { currentTime } = useCurrentTime();
const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

var emp_number = ref('');

const vFocus = {
  mounted: (el) => el.focus()
}

const placeholder = ref('');
const activeButton = ref('AM-IN'); // Keep track of the active button
var msg = ref('');

const updateListsForDate = async (date) => {
  selectedDay.value = date;
  await updateEarlyBirdsList(date);
  await updateNightOwlsList(date);
};

const timeIn = (period) => {
    placeholder.value = `Time In for ${period}`;
    activeButton.value = `${period}-IN`;
    vFocus
};

const timeOut = (period) => {
    placeholder.value = `Time Out for ${period}`;
    activeButton.value = `${period}-OUT`;
    vFocus
    // focusInput();
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

async function updateEarlyBirdsList(date = null) {
  try {
    earlybirds.value = await dtrStore.earlyBirds(date);
  } catch (error) {
    console.error('Could not update early birds:', error);
  }
}

async function updateNightOwlsList(date = null) {
  try {
    nightowls.value = await dtrStore.nightOwls(date);
  } catch (error) {
    console.error('Could not update night owls:', error);
  }
}

</script>

<template>
  <div class="container">
    <div class="employees">
        <span class="week-days">
          <a 
            v-for="{ date, day } in currentTwoWeeks" 
            :key="date" 
            class="day-link"
            :class="{ 'selected-day': selectedDay === date }"
            href="#" 
            @click.prevent="updateListsForDate(date)"
            :title="date"
          >
            {{ day }}
          </a>
        </span>
        <h4>Present</h4>
        <h5>Early Birds</h5>

        <Employee v-for="bird in dtrStore.earlybirds" :employee="bird" :key="bird.user_id" />

        <h5>Night Owls</h5>
        <Employee v-for="owl in dtrStore.nightowls" :employee="owl" :key="owl.user_id" />
    </div>
    <div class="timelog flex flex-column align-items-center justify-content-center">
        <div class="wrapper" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(0, 51, 92, 0) 75%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                  <div v-if="msg" class="w-full text-center font-semibold bg-cyan-400 text-white text-2xl mb-3 p-3 border-2">
                    {{ msg }}
                  </div>
                  <div v-if="!msg" class="w-full text-center font-semibold text-2xl mb-3 p-3">&nbsp;</div>
                    <InputText v-if="isWhitelisted" v-focus id="emp_number" v-model="emp_number" type="text" :placeholder="placeholder" class="w-full md:w-50rem mb-4 text-center" style="padding: 1.5rem" @keyup.enter="submit" />
                    <InputText v-else id="unauthorized" type="text" placeholder="Unauthorized IP. Access Denied." readonly class="w-full md:w-50rem mb-4 text-center" style="padding: 1.5rem; background-color: #ccc;" />
                    <!-- <InputText id="emp_number" v-model="emp_number" type="text" :placeholder="placeholder" class="w-full md:w-50rem mb-4 text-center" style="padding: 1.5rem" @keyup.enter="submit" /> -->
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
  <DtrBirthdays simple />
</template>

<style scoped>
.container {
  display: flex;
  background-color: rgb(239, 243, 248);
  margin-top: -20px;
}

.employees {
  width: 30%;
  height: 87vh;
  margin-left: 3px;
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
  height: 87vh;
  margin-right: 3px;
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

.days-header span {
  font-size: 1.2rem;
  font-weight: bold;
}

.days-header a {
  margin: 0 8px;
  text-decoration: none;
  cursor: pointer;
}

.days-header .selected-day {
  font-weight: bold;
  border-bottom: 2px solid blue;
}

.week-days {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.day-link {
  display: inline-block;
  padding: 3px 5px;
  font-size: 18px;
  border-radius: 10px;
  background: #f3f4f6;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.day-link:hover {
  background: #ffd700;
  transform: translateY(-2px);
}

.selected-day {
  background: #ffd700;
  font-weight: 600;
  color: #1a202c;
  transform: translateY(-2px);
}
</style>
