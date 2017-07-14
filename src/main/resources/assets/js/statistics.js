const statistics = new Vue({
    el: '#statistics',
    data: {
        nappe: 'Toutes',
        type: 'Tous',
        message: '',
        dates: [],
        napes: [],
        types: [],
        names: {},
        chartData: []
    },
    methods: {
        getTypeData(){
            this.nappe = 'Toutes';
            this.getNappes();
            this.getData();
        },
        getNappeData(){
            this.getData();
            this.message = this.type + ' de ' + this.nappe;
        },
        getData(){
            axios.get('/api/statistics/getData', {
                params: {
                    nappe: this.nappe,
                    type: this.type
                }
            }).then(response => {
                if (response.data.length == 0) {
                    this.message = 'Choisir un type ';
                    chart = null;
                } else {
                    if (this.nappe == 'Toutes') {
                        this.getNappes().then(() => {
                            let array = {};
                            let chartdates = {};
                            for (let nappe in this.napes) {
                                array[this.napes[nappe]] = [];
                                chartdates[this.napes[nappe]] = this.napes[nappe]+"Dates";
                                array[this.napes[nappe] + "Dates"] = [];
                                for (let item in response.data) {
                                    if (response.data[item].nappe == this.napes[nappe]) {
                                        array[this.napes[nappe]].push(response.data[item].valeur);
                                        array[this.napes[nappe] + "Dates"].push(response.data[item].date);
                                    }
                                }
                            }
                            this.chartData = array;
                            this.dates = chartdates;
                            let vm = this;
                            let chart = c3.generate({
                                bindto: '#chart',
                                data: {
                                    xs: vm.dates,
                                    xFormat: '%Y',
                                    json: vm.chartData,
                                    names: vm.names,
                                    type: 'bar'
                                },
                                legend: {
                                    position: 'right'
                                },
                                bar: {
                                    width: {
                                        ratio: 0.1
                                    },
                                },
                                axis: {
                                    x: {
                                        type: 'timeseries',
                                        tick: {
                                            format: '%Y'
                                        }
                                    },
                                    y: {
                                        tick: {
                                            outer: false,
                                            format: function (d) {
                                                return Number((d).toFixed(1));
                                            }
                                        }
                                    }
                                },
                            });
                        });
                    } else {
                        let chart = c3.generate({
                            bindto: '#chart',
                            data: {
                                x: 'x',
                                xFormat: '%Y',
                                json: response.data,
                                keys: {
                                    x: 'date',
                                    value: ['valeur'],
                                },
                                type: 'bar',
                            },
                            bar: {
                                width: {
                                    ratio: 0.1 // this makes bar width 50% of length between ticks
                                },
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    tick: {
                                        format: '%Y'
                                    }
                                },
                                y: {
                                    tick: {
                                        outer: false,
                                        format: function (d) {
                                            return Number((d).toFixed(1));
                                        }
                                    }
                                }
                            },
                        });
                        chart.data.names({valeur: this.type});
                    }
                }
            });
        },
        getDates(){
            var vm = this;
            return new Promise(function (resolve, reject) {
                axios.get('/api/statistics/getDates', {
                    params: {
                        type: vm.type
                    }
                }).then(response => {
                    vm.dates = [];
                    vm.dates.push('x');
                    for (let item in response.data) {
                        vm.dates.push(response.data[item]);
                    }
                    resolve();
                });
            });
        },
        getNappes(){
            var vm = this;
            this.message = this.type + ' de zaghouan';
            return new Promise(function (resolve, reject) {
                axios.get('/api/statistics/getNappesWithType', {
                    params: {
                        type: vm.type
                    }
                }).then(response => {
                    vm.napes = response.data;
                    for (let item in response.data) {
                        vm.names[response.data[item]] = response.data[item];
                    }
                    resolve();
                });
            });
        },
    },
    mounted(){
        axios.post('/api/statistics/getTypes').then(response => {
            this.types = response.data;
            this.type =response.data[0];
        });
    }
});