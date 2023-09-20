package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var WStoUDPBytes = promauto.NewCounter(prometheus.CounterOpts{
	Name: "ws_to_udp_bytes",
	Help: "Number of bytes sent from websocket to udp",
})

var WStoUDPPackets = promauto.NewCounter(prometheus.CounterOpts{
	Name: "ws_to_udp_packets",
	Help: "Number of packets sent from websocket to udp",
})

var UDPtoWSBytes = promauto.NewCounter(prometheus.CounterOpts{
	Name: "udp_to_ws_bytes",
	Help: "Number of bytes sent from udp to websocket",
})

var UDPtoWSPackets = promauto.NewCounter(prometheus.CounterOpts{
	Name: "udp_to_ws_packets",
	Help: "Number of packets sent from udp to websocket",
})

var Clients = promauto.NewGauge(prometheus.GaugeOpts{
	Name: "client_udp_count",
	Help: "Number of connected websocket udp clients",
})
