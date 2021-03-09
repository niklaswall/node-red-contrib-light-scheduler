const axios = require('axios')
var pjson = require('./package.json')

module.exports = function (RED) {
  function LightSchedulerSettings(n) {
    RED.nodes.createNode(this, n)
    this.name = n.name
    this.latitude = n.latitude
    this.longitude = n.longitude
  }
  RED.nodes.registerType('light-scheduler-settings', LightSchedulerSettings)

  // Get latitude/longitude using geoip lookup.
  RED.httpAdmin.get('/light-scheduler/geoinfo.json', async function (req, res) {
    try {
      const response = await axios.get(
        'https://2quhxokvva.execute-api.eu-west-1.amazonaws.com/default/light-scheduler-geoip?v=' + pjson.version
      )
      if (response.status != 200) {
        res.status(500)
        res.json(null)
      }
      let data = response.data
      res.status(200)
      res.json({city: data.city, country: data.country_name, latitude: data.latitude, longitude: data.longitude})
    } catch (err) {
      console.error(err)
      res.status(500)
      res.json(null)
    }
  })
}
