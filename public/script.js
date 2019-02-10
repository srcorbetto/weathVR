const sky = document.querySelector('#sky');
const sunMoon = document.querySelector('#sunMoonObject');
const precipitation = document.querySelector('#precipitation');
const object = document.querySelectorAll('.object');
const ground = document.querySelector('#ground');

const trigger = document.querySelectorAll('.text-trigger');
const dataCity = document.querySelector('#data-city');
const dataTemp = document.querySelector('#data-temp');
const dataIcon = document.querySelector('#data-icon');

for (var i = 0; i <= trigger.length; i++) {
    trigger[i].addEventListener('click', e => {
        const getURL = 'http://api.openweathermap.org/data/2.5/weather?id=';
        const query = e.target.attributes.getNamedItem('data-city').value;
        const apiKey = '&APPID=e868ece6c6cfe2601e9f42e7033160d7&units=imperial';
        $.get( `/weather?id=${query}`, data => {
            
            // Weather Object
            const weather = {
                night: null,
                sunriseComparison: data.dt - data.sys.sunrise,
                sunsetComparison: data.dt - data.sys.sunset,
                sunOrMoon: {
                    type: null,
                    scale: null
                },
                skyColor: null,
                temp: data.main.temp,
                ground: null,
                weatherIconKey: data.weather[0].id.toString().charAt(0),
                weatherIconKeyString: data.weather[0].id.toString(),
                city: data.name,
                models: {
                    // Thunderstorms
                    2: {
                        object: '#lightning',
                        scale: '1 1 1',
                        precipitation: 'rain',
                        color: '#4F4F4F',
                        opacity: '0.5'
                    },
                    // Rain
                    3: {
                        object: '#cloud',
                        scale: '.005 .005 .005',
                        precipitation: 'rain',
                        color: '#4F4F4F',
                        opacity: '0.5'
                    },
                    // Rain gusts
                    5: {
                        object: '#cloud',
                        scale: '.005 .005 .005',
                        precipitation: 'rain',
                        color: '#4F4F4F',
                        opacity: '0.5'
                    },
                    // Snow
                    6: {
                        object: '#cloud',
                        scale: '.005 .005 .005',
                        precipitation: 'snow',
                        color: '#fff',
                        opacity: '1'
                    },
                    // Haze
                    7: {
                        object: '#cloud',
                        scale: '.005 .005 .005',
                        precipitation: null
                    },
                    // Clear
                    8: {
                        object: '#',
                        scale: '#',
                        precipitation: null
                    }
                }
            }

            // dt + sky color + sun
            if (data.dt > data.sys.sunset && weather.sunsetComparison < weather.sunriseComparison) {
                weather.night = true;
                weather.skyColor = '#1e1e1e';
                weather.sunOrMoon = {
                    type: '#moon',
                    scale: '0.03 0.03 0.03'
                };
                sky.setAttribute('color', weather.skyColor);

                if (weather.weatherIconKey === '8') {
                    sunMoon.setAttribute('gltf-model', weather.sunOrMoon.type);
                    sunMoon.setAttribute('scale', weather.sunOrMoon.scale);
                } else {
                    sunMoon.setAttribute('gltf-model', '#');
                }
            } else {
                weather.night = false;
                weather.skyColor = '#9ECAE8';
                weather.sunOrMoon = {
                    type: '#sun',
                    scale: '0.01 0.01 0.01'
                };
                sky.setAttribute('color', weather.skyColor);
                
                if (weather.weatherIconKey === '8') {
                    sunMoon.setAttribute('gltf-model', weather.sunOrMoon.type);
                    sunMoon.setAttribute('scale', weather.sunOrMoon.scale);
                    sunMoon.setAttribute('visible', 'true');
                } else {
                    sunMoon.setAttribute('visible', 'false');
                }
            }

            // Ground color
            if (data.main.temp < 32) {
                weather.ground = '#snow';
                // set ground img
                ground.setAttribute('src', weather.ground);
            } else {
                weather.ground = '#grass'
                // set ground img
                ground.setAttribute('src', weather.ground);
            }
            
            // Set city name
            dataCity.setAttribute('text', {
                value: data.name
            });

            // Set temp
            dataTemp.setAttribute('text', {
                value: Math.floor(data.main.temp)
            });

            // Set weather icon...Need to consider time...
            if (weather.weatherIconKey === '8' && weather.night === true) {
                dataIcon.setAttribute('src', `/assets/icons/${weather.weatherIconKey}n.png`);
            } else {
                dataIcon.setAttribute('src', `/assets/icons/${weather.weatherIconKey}.png`);
            }
            dataIcon.setAttribute('material', {
                opacity: 1
            });

            console.log(weather);

            // Set 3D objects
            for (let j = 0; j < object.length; j++) {
                object[j].setAttribute('gltf-model', weather.models[weather.weatherIconKey].object);
                object[j].setAttribute('scale', weather.models[weather.weatherIconKey].scale);
            }

            // set precipitation
            if (weather.weatherIconKey === '2' || weather.weatherIconKey === '3' || weather.weatherIconKey === '5' || weather.weatherIconKey === '6') {
                precipitation.setAttribute('particle-system', {
                    preset: weather.models[weather.weatherIconKey].precipitation,
                    color: weather.models[weather.weatherIconKey].color,
                    opacity: weather.models[weather.weatherIconKey].opacity,
                    enabled: true
                });
            } else {
                precipitation.setAttribute('particle-system', {
                    enabled: false
                });
            }

        });
    });
}