let tagsChart = null;

export class TagUi {
    static topTagsChart(topTags, onTagClick) {
        if (tagsChart) {
            tagsChart.destroy();
        }

        const defaultColor = "#2196F3";
        const selectedColor = "#4CAF50";

        let selectedTags = [];

        const ctx = document.getElementById("myChart");

        let tags = []
        let data = []

        topTags.forEach(([tag, count]) => {
            tags.push(tag);
            data.push(count);   
        })

        let chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: tags,
                datasets: [
                {
                    label: "Top Tags",
                    data: data,
                    borderWidth: 1,
                    backgroundColor: context => {
                        const label = context.chart.data.labels[context.dataIndex];
                        return selectedTags.includes(label) ? selectedColor : defaultColor;
                    }
                },
                ],
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },

                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        let index = elements[0].index;
                        let clickedTag = chart.data.labels[index];

                        if (selectedTags.includes(clickedTag)) {
                            selectedTags = selectedTags.filter(tag => tag !== clickedTag);
                        } else {
                            selectedTags.push(clickedTag);
                        }

                        chart.update();
                        onTagClick(clickedTag);
                    }
                }
            },
        });

        tagsChart = chart;
    }
}


