import axios from 'axios';
import { defineStore } from 'pinia';

// const apiUrl = 'http://157.230.245.80:3001'; //digital ocean
const apiUrl = 'https://node-server.dost9.ph'; // apiServer - proxmox
// const apiUrl = 'http://172.16.110.91:3000'; //local
// const apiUrl = 'http://192.168.1.3:3000';
// const apiUrl = 'https://node-server.dost9.ph';
// const api = axios.create({
//     baseURL: 'http://192.168.0.3:3000',
// });

export const useDtrStore = defineStore('dtr', {
    state: () => ({
        user_id: null,
        fullname: null,
        emp_number: null,
        date: null,
        inAM: null,
        outAM: null,
        inPM: null,
        outPM: null,
        ip: null,
        message: null,
        earlybirds: null,
        nightowls: null,
        employees: null,
    }),

    // getters: {
    //     earlyBirds: (state) => {
    //         // if(state.count % 2 === 0) return 'even'
    //         // return 'odd'
    //         try {
    //             const { data: EarlyBirds } = await axios.get(apiUrl + '/api/hrmis/dtrs');

    //             if (!EarlyBirds.success) {
    //                 return false; // action failed
    //             }

    //             const { data } = EarlyBirds;

    //             this.earlyBirds = data;
    //         } catch (error) {
    //             console.log('ERROR:', error);
    //             if (!error.response) {
    //                 return [];
    //             }

    //             const { data } = error.response;
    //             this.message = data.message; // error on api API
    //         }
    //     }
    // },

    actions: {
        /**
         * Get Early Birds
         * @returns Object of employees
         */
        async earlyBirds(date = null) {
            try {
                // Construct the URL with the optional date query parameter
                let url = apiUrl + '/api/hrmis/earlybirds';
                if (date) {
                    url += `?date=${date}`;
                }

                const { data: earlyBirds } = await axios.get(url);

                if (!earlyBirds.success) {
                    return false; // action failed
                }

                const { data } = earlyBirds;
                this.earlybirds = data;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return [];
                }
            }
        },

        /**
         * Get Night Owls
         * @returns Object of employees
         */
        async nightOwls(date = null) {
            try {
                // Construct the URL with the optional date query parameter
                let url = apiUrl + '/api/hrmis/nightowls';
                if (date) {
                    url += `?date=${date}`;
                }

                const { data: nightOwls } = await axios.get(url);

                if (!nightOwls.success) {
                    return false; // action failed
                }

                const { data } = nightOwls;
                this.nightowls = data;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return [];
                }
            }
        },

        /**
         * Employee Time In - AM
         * @param {String} emp_number Employee Number
         * @returns JSON Object
         *              success: false,
         *              status: Timelog status,
         *              message: Timelog message,
         *              data: employee data
         */
        async TimeInAM(emp_number) {
            try {
                const { data: inAM } = await axios.post(apiUrl + '/api/hrmis/inAM', {
                // const inAM = await axios.post(apiUrl + '/api/hrmis/inAM', {
                    employee_num: emp_number,
                });

                if (!inAM.success) {
                    return false;
                }

                return {
                    success: true,
                    status: inAM.status,
                    message: inAM.message,
                    data: inAM.data
                }                
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data; // error on api API
                return data;
            }
        },

        /**
         * Employee Time Out - AM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeOutAM(emp_number) {
            try {
                const { data: outAM } = await axios.post(apiUrl + '/api/hrmis/outAM', {
                    employee_num: emp_number,
                });

                if (!outAM.success) {
                    return false; // action failed
                }

                return {
                    success: true,
                    status: outAM.status,
                    message: outAM.message,
                    data: outAM.data
                }  
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data;
                return data;
            }
        },

        /**
         * Employee Time In - PM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeInPM(emp_number) {
            try {
                const { data: inPM } = await axios.post(apiUrl + '/api/hrmis/inPM', {
                    employee_num: emp_number,
                });

                if (!inPM.success) {
                    return false; // action failed
                }

                return {
                    success: true,
                    status: inPM.status,
                    message: inPM.message,
                    data: inPM.data
                }
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data;
                return data;
            }
        },

        /**
         * Employee Time Out - PM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeOutPM(emp_number) {
            try {
                const { data: outPM } = await axios.post(apiUrl + '/api/hrmis/outPM', {
                    employee_num: emp_number,
                });

                if (!outPM.success) {
                    return false; // action failed
                }

                return {
                    success: true,
                    status: outPM.status,
                    message: outPM.message,
                    data: outPM.data
                }
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data;
                return data;
            }
        },
    },
});
