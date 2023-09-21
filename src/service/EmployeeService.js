export default class EmployeeService {
    getImages() {
        return fetch('../data/photos.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getImage(employee_id) {
        return this.getImages()
            .then((images) => images.find(image => image.employee_id === employee_id));
    }

    getCelebrants(month) {
        // Ensure the month is formatted as two digits (e.g., "03" for March)
        const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const thisDate = today.getDate();

    return this.getImages()
      .then((employees) => {
        const todayBirthday = [];
        const recentBirthdays = [];
        const upcomingBirthdays = [];

        employees.forEach((employee) => {
          if (employee.bday) {
            const [year, month, day] = employee.bday.split('-').map(Number);
            // const bdayThisYear = new Date(today.getFullYear(), month - 1, day);

            // Check if today is the birthday
            if (month === thisMonth && day === thisDate) {
                todayBirthday.push(employee);
            }

            if (month === thisMonth && day < thisDate) {
                recentBirthdays.push(employee);
            }
  
            // Check for upcoming birthdays (days after today within the same month)
            if (month === thisMonth && day > thisDate) {
                upcomingBirthdays.push(employee);
            }
          }
        });

        return {
          todayBirthday,
          recentBirthdays,
          upcomingBirthdays,
        };
      });
    }
}