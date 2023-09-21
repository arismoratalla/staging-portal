<script setup>
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';

import EmployeeService from '@/service/EmployeeService';

import { ref, toRefs, onMounted } from 'vue';
// import { useLayout } from '@/layout/composables/layout';

const todayBirthday = ref([]);
const recentBirthdays = ref([]);
const upcomingBirthdays = ref([]);

defineProps({
    simple: {
        type: Boolean,
        default: false
    },
    employees: [],
});

const employeeService = new EmployeeService();

const scales = ref([12, 13, 14, 15, 16]);
const visible = ref(false);

// const { changeThemeSettings, setScale, layoutConfig } = useLayout();

const onConfigButtonClick = () => {
    visible.value = !visible.value;
};

const d = new Date();

let employees = ref([]);

onMounted(async () => {
  try {
    const { todayBirthday: t, recentBirthdays: r, upcomingBirthdays: u } = await employeeService.getCelebrants();
    todayBirthday.value = t;
    recentBirthdays.value = r;
    upcomingBirthdays.value = u;
  } catch (err) {
    console.error(err); // handle any errors
  }
});

function libre() {
    if(Math.random() > 0.5)
        return 'Nag Blowout na!!!';
    else
        return 'Hindi pa ng Blowout!!!';
}
</script>

<template>
    <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
        <i class="pi pi-calendar"></i>
    </button>

    <Sidebar v-model:visible="visible" position="right" :transitionOptions="'.3s cubic-bezier(0, 0, 0.2, 10)'" class="layout-config-sidebar w-20rem">
        <h5>Today's Birthdays</h5>
        <Avatar 
            v-for="employee in todayBirthday" 
            :image="employee.thumbnailImageSrc" 
            size="xlarge" shape="circle" 
            class="mr-2" 
            v-tooltip="employee.fullname + ' (' + employee.bday.split('-')[2]+ ')'" 
            :title="libre()"/>
        
        <h5>Recent Birthdays</h5>
        <Avatar 
            v-for="employee in recentBirthdays" 
            :image="employee.thumbnailImageSrc" 
            size="xlarge" shape="circle" 
            class="mr-2" 
            v-tooltip="employee.fullname + ' (' + employee.bday.split('-')[2]+ ')'" 
            :title="libre()"/>

        <h5>Upcoming Birthdays</h5>
        <Avatar 
            v-for="employee in upcomingBirthdays" 
            :image="employee.thumbnailImageSrc" 
            size="xlarge" 
            shape="circle" 
            class="mr-2" 
            v-tooltip="employee.fullname + ' (' + employee.bday.split('-')[2]+ ')'" 
            :title="libre()"/>
    </Sidebar>
</template>

<style lang="scss" scoped></style>
