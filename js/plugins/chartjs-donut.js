//doughut chart
var ctx = document.getElementById("most-selling-items");
// ctx.height = 175;

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Starter", "BRONZE", "SILVER"],
        datasets: [{
            label: '# of Sales',
            data: [450, 1230, 600],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});