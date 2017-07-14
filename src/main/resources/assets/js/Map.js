import {FormBuilder} from './FormBuilder';
export class Map {
    constructor({
        layers = [],
        defaultLayer = '',
        featureNS = 'http://ihz',
        srsName = 'EPSG:32632',
        workspace = 'ihz',
        format = 'image/png',
        url = 'http://localhost:8080/geoserver',
        btnSelect = {},
        btnDelete = {},
        btnDraw = {},
        btnPoint = {},
        btnLine = {},
        btnEdit = {},
        btnMesure = {},
        google = false,
        bing = true,
        layers_primary_key = 'ID',
        helpTooltipElement = null,
        sketch = null,
        helpTooltip = {},
        measureTooltipElement = null,
        measureTooltip = {},
        draw = {},
        pointerMove = null,
        mesureSource = new ol.source.Vector(),
    } = {}) {
        this.bing = bing;
        this.layers = layers;
        this.layers_primary_key = layers_primary_key;
        this.defaultLayer = defaultLayer;
        this.featureNS = featureNS;
        this.srsName = srsName;
        this.workspace = workspace;
        this.format = format;
        this.url = url;
        this.bounds = [553582.863643649, 3984163.3300781306,
            625006.0800781315, 4053139.11661919];
        this.formatGeoJSON_array = {};
        this.sourceWFS_array = {};
        this.styles_array = {};
        this.layersWFS_array = {};
        this.formatGML_array = {};
        this.formatWFS_array = {};
        this.map = {};
        this.btnSelect = btnSelect;
        this.btnDelete = btnDelete;
        this.btnDraw = btnDraw;
        this.btnPoint = btnPoint;
        this.btnEdit = btnEdit;
        this.btnLine = btnLine;
        this.btnMesure = btnMesure;
        this.interactionSelect = new ol.interaction.Select({
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255,0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#FF2828'
                })
            }),
            geometryName: 'the_geom'
        });
        this.interactionDelete = new ol.interaction.Select();
        this.iSelect = new ol.interaction.Select({
            wrapX: false
        });
        let _this = this;
        this.iEdit = new ol.interaction.Modify({
            features: _this.iSelect.getFeatures(),
        });
        this.projection = {};
        this.google = google;
        this.perimetreArray = [];
        this.perimetre = 0;
        this.helpTooltipElement = helpTooltipElement;
        this.sketch = sketch;
        this.helpTooltip = helpTooltip;
        this.measureTooltipElement = measureTooltipElement;
        this.measureTooltip = measureTooltip;
        this.draw = draw;
        this.mesureSource = new ol.source.Vector();
        this.pointerMove = pointerMove;
    }


    initGeolocation(is_active) {
        if (is_active) {
            let _this = this;
            var geolocation = new ol.Geolocation({
                projection: _this.map.getView().getProjection()
            });
            var accuracyFeature = new ol.Feature();
            geolocation.on('change:accuracyGeometry', function () {
                accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
            });
            var positionFeature = new ol.Feature();
            positionFeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: '#3399CC'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 2
                    })
                })
            }));
            geolocation.on('change:position', function () {
                var coordinates = geolocation.getPosition();
                positionFeature.setGeometry(coordinates ?
                    new ol.geom.Point(coordinates) : null);
            });

            let geoLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [accuracyFeature, positionFeature]
                })
            });
            geoLayer.set('name', 'geoLayer');
            _this.map.addLayer(geoLayer);
            geolocation.setTracking(is_active);
        } else {
            let _this = this;
            this.map.getLayers().forEach(function (lyr) {
                if ('geoLayer' == lyr.get('name')) {
                    _this.map.removeLayer(lyr);
                }
            });
        }
    }

    createMap() {
        let _this = this;
        var mousePositionControl = new ol.control.MousePosition({
            className: 'custom-mouse-position',
            target: document.getElementById('location'),
            coordinateFormat: ol.coordinate.createStringXY(5),
            undefinedHTML: '&nbsp;'
        });
        var projection = this.getProjection();
        var view = new ol.View({
            projection: projection,
            Zoom: 21,
        });
        if (this.google) {
            jQuery('#map').html('<div id="olmap" class="fill"></div><div id="gmap" class="fill"></div>');
            this.map = new ol.Map({
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false
                }).extend([
                    new ol.interaction.MouseWheelZoom(),
                    new ol.interaction.DragPan()
                ]),
                controls: ol.control.defaults({
                    zoom: true,
                    attribution: false
                }).extend([mousePositionControl]),
                target: 'olmap',
                view: view
            });
            var mapOptions = {
                mapTypeControl: true,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    mapTypeIds: [
                        google.maps.MapTypeId.SATELLITE,
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.TERRAIN,
                        google.maps.MapTypeId.HYBRID
                    ]
                },
                zoomControl: false
            };
            var gmap = new google.maps.Map(document.getElementById('gmap'), mapOptions);
            this.map.getView().on('change:center', function () {
                var view = _this.map.getView();
                var projection = view.getProjection();
                var center = view.getCenter();
                center = ol.proj.transform(center, projection, 'EPSG:4326');
                gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
            });
            this.map.getView().on('change:resolution', function () {
                var zoom = _this.map.getView().getZoom();
                gmap.setZoom(zoom);
            });
            var olMapDiv = document.getElementById('olmap');
            olMapDiv.parentNode.removeChild(olMapDiv);
            gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
        } else if (this.bing) {
            let l = new ol.layer.Tile({
                visible: true,
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: 'AuGIRikTzpl0eFlAU2U0SIxTpeFtXwzvWjUhWgmzNEHFNvTF_w-MkGW7l1bhMuGn',
                    imagerySet: 'AerialWithLabels'
                })
            });
            this.map = new ol.Map({
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false
                }).extend([
                    new ol.interaction.MouseWheelZoom(),
                    new ol.interaction.DragPan()
                ]),
                controls: ol.control.defaults({
                    zoom: true,
                    attribution: false
                }).extend([mousePositionControl]),
                layers: [l],
                loadTilesWhileInteracting: true,
                target: 'map',
                view: view
            });
        }
        else {
            jQuery('#map').html('<div id="olmap" class="fill"></div>');
            this.map = new ol.Map({
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false
                }).extend([
                    new ol.interaction.MouseWheelZoom(),
                    new ol.interaction.DragPan()
                ]),
                controls: ol.control.defaults({
                    zoom: true,
                    attribution: false
                }).extend([mousePositionControl]),
                target: 'olmap',
                view: view
            });
        }
    }

    getDraw() {
        let _this = this;
        return new ol.interaction.Draw({
            type: 'MultiPolygon',
            source: this.layersWFS_array[_this.layers[0]['name']].getSource(),
            geometryName: 'the_geom'
        });
    }

    getPointDraw() {
        let _this = this;
        return new ol.interaction.Draw({
            type: 'Point',
            source: this.layersWFS_array[_this.layers[0]['name']].getSource(),
            geometryName: 'the_geom'
        });
    }

    getLineDraw() {
        let _this = this;
        return new ol.interaction.Draw({
            type: 'MultiLineString',
            source: this.layersWFS_array[_this.layers[0]['name']].getSource(),
            geometryName: 'the_geom'
        });
    }

    getProjection() {
        let _this = this;
        if (this.google || this.bing) {
            this.defProj4();
            return new ol.proj.Projection({
                code: 'EPSG:3857',
                units: 'm',
                axisOrientation: 'neu'
            });
        } else {
            return new ol.proj.Projection({
                code: _this.srsName,
                units: 'm',
                axisOrientation: 'neu'
            });
        }
    }

    defProj4() {
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        proj4.defs("EPSG:22332", "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs");
    }

    createFormatGML(layerName) {
        let _this = this;
        return new ol.format.GML({
            featureNS: _this.featureNS,
            featureType: layerName,
            srsName: _this.srsName
        });
    }

    createFormatWFS(layerName) {
        let _this = this;
        return new ol.format.WFS({
            featureNS: _this.featureNS,
            featureType: _this.workspace + ':' + layerName,
            srsName: _this.srsName
        });
    }

    createImageWMS(layerName) {
        let _this = this;
        return new ol.layer.Image({
            source: new ol.source.ImageWMS({
                ratio: 1,
                url: _this.url + '/' + _this.workspace + '/wms',
                params: {
                    'FORMAT': _this.format,
                    'VERSION': '1.1.1',
                    STYLES: '',
                    LAYERS: _this.workspace + ':' + layerName
                }
            })
        });
    }

    createStyle(color, stroke, geometryType) {
        var style;

        if (geometryType === "Point") {
            console.log("if point " + geometryType);
            console.log(color);
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            });
        } else {
            console.log("if not point " + geometryType);
            console.log(color);
            style = new ol.style.Style({
                fill: new ol.style.Fill({color: color}),
                stroke: new ol.style.Stroke({color: stroke})
            });
        }
        return style;
    }

    createFormatGeoJSON(layerName) {
        let _this = this;
        return new ol.format.GeoJSON({
            featureNS: _this.featureNS,
            featureType: _this.workspace + ':' + layerName,
            srsname: _this.srsName,
        });
    }

    createSourceWFS(layerName, key) {
        let _this = this;
        let projection = _this.getProjection();
        let sourceWFS;
        let features = [];
        sourceWFS = new ol.source.Vector({
                loader: function (extent, resolution, projection) {
                    jQuery.ajax(_this.url + '/' + _this.workspace + '/wfs', {
                        type: 'GET',
                        data: {
                            service: 'WFS',
                            version: '2.0.0',
                            outputFormat: 'application/json',
                            request: 'GetFeature',
                            typename: _this.workspace + ':' + layerName,
                            srsname: _this.srsName,
                            bbox: extent.join(',')
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            if (xhr.status == 404) {
                                Event.$emit('alert', "un problème est survenu lors de chargement des cartes !! vérifier que votre serveur cartographique ou votre configuration geoserver !!");
                            }
                        },
                        beforeSend:function(){

                        },
                        success: function (response) {
                            if (_this.google || _this.bing) {
                                features = _this.formatGeoJSON_array[layerName].readFeatures(response, {
                                    dataProjection: _this.srsName,
                                    featureProjection: 'EPSG:3857'
                                });
                                _this.layers[key]['geometryType'] = features[0].getGeometry().getType();
                            }
                            sourceWFS.addFeatures(features);
                        },
                    })
                },
                strategy: ol.loadingstrategy.bbox,
                projection: 'EPSG:3857'
            }
        );
        return sourceWFS;
    }

    getGeometryType(layerName) {
        let _this = this;
        return new Promise((resolve, reject) => {
            jQuery.ajax(_this.url + '/' + _this.workspace + '/wfs', {
                type: 'GET',
                data: {
                    service: 'WFS',
                    version: '2.0.0',
                    outputFormat: 'application/json',
                    request: 'GetFeature',
                    typename: _this.workspace + ':' + layerName,
                    srsname: _this.srsName,
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 404) {
                        Event.$emit('alert', "un problème est survenu lors de chargement des cartes !! vérifier que votre serveur cartographique ou votre configuration geoserver !!");
                    }
                },
                success: function (response) {
                    let features = _this.createFormatGeoJSON(layerName).readFeatures(response, {
                        dataProjection: _this.srsName,
                        featureProjection: 'EPSG:3857'
                    });
                    resolve(features[0].getGeometry().getType());
                },
            });
        });
    }

    createLayerWFS(layerName, key) {
        let _this = this;
        return new ol.layer.Vector({
            name: layerName,
            source: _this.sourceWFS_array[layerName],
            style: _this.styles_array[layerName]
        });

    }

    addFormatGML() {
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['active']) {
                _this.formatGML_array[_this.layers[key]['name']] = _this.createFormatGML(_this.layers[key]['name']);
            }
        });
    }

    addFormatWFS() {
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['active']) {
                _this.formatWFS_array[_this.layers[key]['name']] = _this.createFormatWFS(_this.layers[key]['name']);
            }
        });
    }

    addImageWMS() {
        var imageWMS_array = {};
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['active']) {
                imageWMS_array[_this.layers[key]['name']] = _this.createImageWMS(_this.layers[key]['name']);
            }
        });
        return imageWMS_array;
    }

    addLayersToMap() {
        let _this = this;
        _this.createMap();
        jQuery("#legende").html('<h2>Légende</h2>');
        jQuery.each(_this.layers, function (key, value) {
            _this.formatGeoJSON_array[_this.layers[key]['name']] = _this.createFormatGeoJSON(_this.layers[key]['name']);
            _this.getGeometryType(_this.layers[key]['name']).then(geometryType => {
                _this.styles_array[_this.layers[key]['name']] = _this.createStyle(_this.layers[key]['color'], _this.layers[key]['stroke'], geometryType);
                _this.sourceWFS_array[_this.layers[key]['name']] = _this.createSourceWFS(_this.layers[key]['name'], key);
                _this.layersWFS_array[_this.layers[key]['name']] = _this.createLayerWFS(_this.layers[key]['name'], key);
                _this.map.addLayer(_this.layersWFS_array[_this.layers[key]['name']]);
            });
            var storage = jQuery.localStorage;
            storage.set(key, 'checked');
            jQuery("#legende").append("" +
                "<div style='flex-basis: 15%;display: flex;'>" +
                "<div style='background-color: " + _this.layers[key]['stroke'] + "' class='slideThree'>" +
                "<input onclick='carte.map.layersManagement(\x22" + _this.layers[key]['name'] + "\x22)' id='" + _this.layers[key]['name'] + "' type='checkbox' checked='true'/>" +
                "<label for='" + _this.layers[key]['name'] + "'></label>" +
                "</div>" +
                "<p style='margin-left: 5px;margin-right:5px'>" + _this.layers[key]['name'] + "</p>" +
                "</div>");
        });

        if (_this.google || _this.bing) {
            _this.map.getView().fit(ol.proj.transformExtent(_this.bounds, _this.srsName, 'EPSG:3857'), _this.map.getSize());
            _this.map.getView().setZoom(7);
        } else {
            _this.map.getView().fit(_this.bounds, _this.map.getSize());
        }
        return _this.layersWFS_array;
    }

    layersManagement(layer) {
        let vm = this;

        console.log(layer);
        if ($('#' + layer).is(':checked')) {
            console.log('trigger add layer to map');
            vm.addLayerToMap(layer);
        }
        else {
            console.log('trigger remove layer from map');
            vm.deleteLayerFromMap(layer);
        }
    }

    detectActionButton() {
        let _this = this;
        _this.btnSelect.click(function () {
            _this.selectAction();
        });
        _this.btnDelete.click(function () {
            _this.deleteAction();
        });
        _this.btnDraw.click(function () {
            _this.drawAction();
        });
        _this.btnEdit.click(function () {
            _this.editAction();

        });
        _this.btnPoint.click(function () {
            _this.drawPointAction();

        });
        _this.btnLine.click(function () {
            _this.drawLineAction();

        });
        _this.btnMesure.click(function () {
            _this.measurementTool();
        });
    }

    transactWFS(mode, f, layerSelected, interaction) {
        let _this = this;
        var node;
        switch (mode) {
            case 'insert':
                node = _this.formatWFS_array[layerSelected].writeTransaction([f], null, null, _this.formatGML_array[layerSelected]);
                break;
            case 'update':
                node = _this.formatWFS_array[layerSelected].writeTransaction(null, [f], null, _this.formatGML_array[layerSelected]);
                _this.removeNodeForWfsUpdate(node, "geometry");
                break;
            case 'delete':
                node = _this.formatWFS_array[layerSelected].writeTransaction(null, null, [f], _this.formatGML_array[layerSelected]);
                break;
        }
        var s = new XMLSerializer();
        var payload = s.serializeToString(node);
        jQuery.ajax(carte.geoserver.url + '/' + carte.geoserver.workspace + '/wfs', {
            type: 'POST',
            dataType: 'xml',
            processData: false,
            contentType: 'text/xml',
            data: payload,
            success: function (data) {
                if (mode != 'delete') {
                    _this.sourceWFS_array[layerSelected].clear();
                    _this.map.removeInteraction(interaction);
                }
            }
        }).done();
    }

    measurementTool() {

        let _this = this;
        _this.btnMesure.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        _this.btnMesure.addClass('active');
        /**
         * Message to show when the user is drawing a line.
         * @type {string}
         */
        var continueLineMsg = 'Cliquez pour continuer à mésurer';

        this.addInteraction();

        this.pointerMove = this.map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            /** @type {string} */
            var helpMsg = 'Cliquez pour commencer à mésurer';

            if (_this.sketch) {
                var geom = (_this.sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg;
                }
            }

            _this.helpTooltipElement.innerHTML = helpMsg;
            _this.helpTooltip.setPosition(evt.coordinate);

            _this.helpTooltipElement.classList.remove('hidden');
        });
        this.map.getViewport().addEventListener('mouseout', _this.hideHelpToolTip);


    }

    hideHelpToolTip() {
        let _this = this;
        _this.helpTooltipElement.classList.add('hidden');
    }

    addInteraction() {
        var type = 'LineString';
        let _this = this;
        _this.draw = new ol.interaction.Draw({
            source: _this.mesureSource,
            type: /** @type {ol.geom.GeometryType} */ (type),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
        this.map.addInteraction(_this.draw);
        this.createMeasureTooltip(this);
        this.createHelpTooltip(this);
        var listener;
        _this.draw.on('drawstart', function (evt) {
            // set sketch
            _this.sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = _this.sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.LineString) {
                    output = _this.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                _this.measureTooltipElement.innerHTML = output;
                _this.measureTooltip.setPosition(tooltipCoord);
            });
        });
        _this.draw.on('drawend', function () {
            _this.measureTooltipElement.className = 'tooltip tooltip-static';
            _this.measureTooltip.setOffset([0, -7]);
            // unset sketch
            _this.sketch = null;
            // unset tooltip so that a new one can be created
            _this.measureTooltipElement = null;
            //_this.createMeasureTooltip();
            _this.helpTooltipElement = null;
            _this.map.removeOverlay(_this.measureTooltip);
            _this.map.removeOverlay(_this.helpTooltip);
            ol.Observable.unByKey(listener);
            _this.map.removeInteraction(_this.draw);
            _this.btnMesure.removeClass('active');
            ol.Observable.unByKey(_this.pointerMove);
            _this.map.getViewport().removeEventListener('mouseout', _this.hideHelpToolTip);
        });
    }

    /**
     * Creates a new help tooltip
     */

    createHelpTooltip() {
        let _this = this;
        if (_this.helpTooltipElement) {
            _this.helpTooltipElement.parentNode.removeChild(_this.helpTooltipElement);
        }
        _this.helpTooltipElement = document.createElement('div');
        _this.helpTooltipElement.className = 'tooltip hidden';
        _this.helpTooltip = new ol.Overlay({
            element: _this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        _this.map.addOverlay(_this.helpTooltip);
    }

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip() {
        let _this = this;
        if (_this.measureTooltipElement) {
            _this.measureTooltipElement.parentNode.removeChild(_this.measureTooltipElement);
        }
        _this.measureTooltipElement = document.createElement('div');
        _this.measureTooltipElement.className = 'tooltip tooltip-measure';
        _this.measureTooltip = new ol.Overlay({
            element: _this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        _this.map.addOverlay(_this.measureTooltip);
    }

    formatLength(line) {
        var length;
        var wgs84Sphere = new ol.Sphere(6378137);
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = this.map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    }


    deleteFeatures(interaction, selectedFeat, vectorSource) {
        if (selectedFeat.getLength() > 0) {
            var toDeleteFeat = interaction.getFeatures().getArray()[0];
            vectorSource.removeFeature(toDeleteFeat);
            interaction.getFeatures().remove(toDeleteFeat);
        }
        else
            window.alert("Please select a layer first :" + selectedFeat.getLength());
    }

    editAction() {
        let _this = this;
        _this.addFormatWFS();
        _this.addFormatGML();
        this.btnEdit.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        this.btnEdit.addClass('active');
        this.map.addInteraction(this.iSelect);
        this.map.addInteraction(this.iEdit);
        var s = new XMLSerializer();
        let dirty = {};
        var layerSelected = '';
        _this.iSelect.getFeatures().on('add', function (e) {
            layerSelected = e.target.item(0).getLayer(_this.map).get('name');
            e.element.on('change', function (e) {
                dirty[e.target.getId()] = true;
            });
        });
        _this.iSelect.getFeatures().on('remove', function (e) {
            var f = e.element;
            if (dirty[f.getId()]) {
                delete dirty[f.getId()];
                var featureProperties = f.getProperties();
                delete featureProperties.boundedBy;
                var clone = new ol.Feature({
                    the_geom: f.getGeometry()
                });
                clone.setProperties(featureProperties);
                clone.setGeometryName("the_geom");
                var newFeature;
                if (clone.getGeometry().getType() === "MultiLineString") {
                    newFeature = _this.transform_line_geometry(clone);
                } else {
                    newFeature = _this.transform_geometry(clone);
                    newFeature.set('SUPERFICIE', _this.formatArea(f.getGeometry()));
                }

                newFeature.setId(f.getId());
                _this.transactWFS('update', newFeature, layerSelected, _this.iEdit);
            }
        });
    }

    removeNodeForWfsUpdate(node, valueToRemove) {
        var propNodes = node.getElementsByTagName("Property");
        for (var i = 0; i < propNodes.length; i++) {
            var propNode = propNodes[i];
            var propNameNode = propNode.firstElementChild;
            var propNameNodeValue = propNameNode.firstChild;
            if (propNameNodeValue.nodeValue === valueToRemove) {
                propNode.parentNode.removeChild(propNode);
                break;
            }
        }
    }

    getActiveLayers(layers) {
        let active_layers_array = {};
        jQuery.each(layers, function (key, value) {
            if (layers[key]['active']) {
                active_layers_array[key] = layers[key];
            }
        });
        return active_layers_array;
    }

    selectAction() {
        let _this = this;
        _this.btnSelect.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        _this.btnSelect.addClass('active');
        _this.map.removeInteraction(_this.getDraw());
        _this.interactionSelect.on('select', function (evt) {
            var view = _this.map.getView();
            let imageWMS_array = _this.addImageWMS();
            var viewResolution = view.getResolution();
            var mail = '';
            var info = '';
            jQuery.each(imageWMS_array, function (key, value) {
                var source = imageWMS_array[key].getSource();
                var url = source.getGetFeatureInfoUrl(
                    evt.mapBrowserEvent.coordinate, viewResolution, view.getProjection(),
                    {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});
                var aa = evt.selected[0].getGeometry().getExtent();
                var oo = ol.extent.getCenter(aa);
                _this.defProj4();
                var coord = ol.proj.transform(oo, 'EPSG:3857', 'EPSG:4326');
                var lon = coord[0];
                var lat = coord[1];

                if (url) {
                    jQuery.ajax({
                        url: url,
                        dataType: 'json'
                    }).then(function (response) {
                        var feature = response.features[0];
                        if (feature !== undefined) {
                            var props = feature.properties;
                            info += '<h2 style="font-size:14px;color:#FFFFFF;display:inline;margin-bottom:15px;font-weight:bold;border-bottom:1px solid #FFFFFF">' + key + '</h2><div style="color:#ffffff;border: none;line-height:30px;padding:10px;font-size:13px">';
                            jQuery.each(props, function (key, value) {
                                info += '<div class="col-md-4">' + key + ':</div><div class="col-md-8">' + value + '</div>';
                            });
                            info += '</div>';
                            jQuery("#infosPopup").show();
                            jQuery("#infosPopup-bottom").show();
                            jQuery('#closePopup').click(function () {
                                jQuery("#infosPopup").hide();
                                jQuery("#infosPopup-bottom").hide();
                            });
                            document.getElementById('infosPopupCont').innerHTML = info;
                        }
                    });
                }
            });
        });
        _this.map.addInteraction(_this.interactionSelect);
    }

    deleteAction() {
        let _this = this;
        _this.addFormatWFS();
        _this.addFormatGML();
        _this.btnDelete.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        _this.btnDelete.addClass('active');
        _this.map.removeInteraction(_this.interactionSelect);
        _this.map.removeInteraction(_this.iSelect);
        _this.map.removeInteraction(_this.iEdit);
        _this.map.removeInteraction(_this.getDraw());
        _this.map.addInteraction(this.interactionDelete);
        _this.interactionDelete.getFeatures().on('add', function (e) {
            var layerSelected = e.target.item(0).getLayer(_this.map);
            _this.transactWFS('delete', e.target.item(0), layerSelected.get('name'), _this.interactionDelete);
        });
    }

    drawAction() {
        let _this = this;
        this.btnDraw.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        this.btnDraw.addClass('active');
        this.map.removeInteraction(this.interactionSelect);
        this.map.removeInteraction(this.interactionDelete);
        let interactionDraw = this.getDraw();
        document.addEventListener('keydown', function (e) {
            if (e.which == 27)
                interactionDraw.removeLastPoint();
        });
        interactionDraw.on('drawstart', function (e) {
            _this.perimetreArray = [];
            _this.map.on('singleclick', function (evt) {
                var sourceProj = _this.map.getView().getProjection();
                _this.perimetreArray.push(ol.proj.transform(evt.coordinate, sourceProj, 'EPSG:4326'));
            });
        });
        interactionDraw.on('drawend', function (e) {
            _this.map.removeInteraction(interactionDraw);
            _this.defProj4();
            var extent = e.feature.getGeometry().getExtent();
            var center = ol.extent.getCenter(extent);
            var newFeature = _this.transform_geometry(e.feature);
            var coord = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
            var lon = coord[0];
            var lat = coord[1];
            var props;
            jQuery("#sendMailNewData").click();
            _this.addFormatWFS();
            _this.addFormatGML();
            let form = new FormBuilder();
            form.init('POST', _this.getActiveLayers(_this.layers), newFeature);
            jQuery('#select_layer').change(function () {
                var array = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().sort(
                    function (a, b) {
                        return a.get(_this.layers_primary_key) - b.get(_this.layers_primary_key);
                    }
                );
                var fid = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().length;
                newFeature.setId(array[fid - 1].get(_this.layers_primary_key) + 1);
                props = form.create(jQuery('#select_layer').val(), _this.layersWFS_array, _this.formatPerimetre(e.feature.getGeometry()), _this.formatArea(e.feature.getGeometry()), _this.layers_primary_key, newFeature.getId());
            });
            jQuery("#saveFeature").click(function () {
                form.submit(jQuery('#select_layer').val(), props, newFeature, _this.formatWFS_array, _this.formatGML_array, _this.formatPerimetre(e.feature.getGeometry()), _this.formatArea(e.feature.getGeometry())).then(response => {
                    carte.form.model.lon = lon;
                    carte.form.model.lat = lat;
                    carte.form.model.feature = response;
                });
            });
        });
        this.map.addInteraction(interactionDraw);
    }

    drawPointAction() {
        let _this = this;
        this.btnPoint.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        this.btnPoint.addClass('active');
        this.map.removeInteraction(this.interactionSelect);
        this.map.removeInteraction(this.interactionDelete);
        let interactionDraw = this.getPointDraw();
        document.addEventListener('keydown', function (e) {
            if (e.which == 27)
                interactionDraw.removeLastPoint();
        });
        interactionDraw.on('drawstart', function (e) {
            _this.perimetreArray = [];
            _this.map.on('singleclick', function (evt) {
                var sourceProj = _this.map.getView().getProjection();
                _this.perimetreArray.push(ol.proj.transform(evt.coordinate, sourceProj, 'EPSG:4326'));
            });
        });
        interactionDraw.on('drawend', function (e) {
            _this.map.removeInteraction(interactionDraw);
            _this.defProj4();
            var extent = e.feature.getGeometry().getExtent();
            var center = ol.extent.getCenter(extent);
            var newFeature = _this.transform_point_geometry(e.feature);
            var coord = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
            var lon = coord[0];
            var lat = coord[1];
            var props;
            jQuery("#sendMailNewData").click();
            _this.addFormatWFS();
            _this.addFormatGML();
            let form = new FormBuilder();
            form.init('POST', _this.getActiveLayers(_this.layers), newFeature);
            jQuery('#select_layer').change(function () {
                var array = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().sort(
                    function (a, b) {
                        return a.get(_this.layers_primary_key) - b.get(_this.layers_primary_key);
                    }
                );
                var fid = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().length;
                newFeature.setId(array[fid - 1].get(_this.layers_primary_key) + 1);
                props = form.createPoint(jQuery('#select_layer').val(), _this.layersWFS_array);
            });
            jQuery("#saveFeature").click(function () {
                form.submit(jQuery('#select_layer').val(), props, newFeature, _this.formatWFS_array, _this.formatGML_array).then(response => {
                    carte.form.model.lon = lon;
                    carte.form.model.lat = lat;
                    carte.form.model.feature = response;
                });
            });
        });
        this.map.addInteraction(interactionDraw);
    }

    drawLineAction() {
        let _this = this;
        this.btnLine.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        this.btnLine.addClass('active');
        this.map.removeInteraction(this.interactionSelect);
        this.map.removeInteraction(this.interactionDelete);
        let interactionDraw = this.getLineDraw();
        document.addEventListener('keydown', function (e) {
            if (e.which == 27)
                interactionDraw.removeLastPoint();
        });
        interactionDraw.on('drawstart', function (e) {
            _this.perimetreArray = [];
            _this.map.on('singleclick', function (evt) {
                var sourceProj = _this.map.getView().getProjection();
                _this.perimetreArray.push(ol.proj.transform(evt.coordinate, sourceProj, 'EPSG:4326'));
            });
        });
        interactionDraw.on('drawend', function (e) {
            _this.map.removeInteraction(interactionDraw);
            _this.defProj4();
            var extent = e.feature.getGeometry().getExtent();
            var center = ol.extent.getCenter(extent);
            console.log(center);
            var newFeature = _this.transform_line_geometry(e.feature);
            var coord = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
            var lon = coord[0];
            var lat = coord[1];
            var props;
            jQuery("#sendMailNewData").click();
            _this.addFormatWFS();
            _this.addFormatGML();
            let form = new FormBuilder();
            form.init('POST', _this.getActiveLayers(_this.layers), newFeature);
            jQuery('#select_layer').change(function () {
                var array = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().sort(
                    function (a, b) {
                        return a.get(_this.layers_primary_key) - b.get(_this.layers_primary_key);
                    }
                );
                var fid = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().length;
                newFeature.setId(array[fid - 1].get(_this.layers_primary_key) + 1);
                props = form.createLine(jQuery('#select_layer').val(), _this.layersWFS_array, _this.formatPerimetre(e.feature.getGeometry()));
            });
            jQuery("#saveFeature").click(function () {
                form.submit(jQuery('#select_layer').val(), props, newFeature, _this.formatWFS_array, _this.formatGML_array).then(response => {
                    carte.form.model.lon = lon;
                    carte.form.model.lat = lat;
                    carte.form.model.feature = response;
                });
            });
        });
        this.map.addInteraction(interactionDraw);
    }

    transform_geometry(element) {
        // var sourceProj = this.map.getView().getProjection();
        // console.log(sourceProj);
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        // console.log(element.getGeometry().getCoordinates());
        // let newFeature = element.clone();
        // newFeature.getGeometry().transform(sourceProj,"EPSG:32632");
        let newFeature = element.clone();
        var polyCoords = [];
        var coords = element.getGeometry().getCoordinates();
        console.log(coords);
        for (var i in coords[0][0]) {
            var c = coords[0][0][i];
            polyCoords.push(ol.proj.transform([parseFloat(c[0]), parseFloat(c[1])], 'EPSG:3857', 'EPSG:32632'));
        }
        newFeature.getGeometry().setCoordinates([[polyCoords]]);
        console.log(newFeature.getGeometry().getCoordinates());
        return newFeature;
    }

    transform_line_geometry(element) {
        // var sourceProj = this.map.getView().getProjection();
        // console.log(sourceProj);
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        // console.log(element.getGeometry().getCoordinates());
        // let newFeature = element.clone();
        // newFeature.getGeometry().transform(sourceProj,"EPSG:32632");
        let newFeature = element.clone();
        var polyCoords = [];
        var coords = element.getGeometry().getCoordinates();
        console.log(coords);
        for (var i in coords[0]) {
            var c = coords[0][i];
            polyCoords.push(ol.proj.transform([parseFloat(c[0]), parseFloat(c[1])], 'EPSG:3857', 'EPSG:32632'));
        }
        newFeature.getGeometry().setCoordinates([polyCoords]);
        console.log(newFeature.getGeometry().getCoordinates());
        return newFeature;
    }

    transform_point_geometry(element) {
        // var sourceProj = this.map.getView().getProjection();
        // console.log(sourceProj);
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        // console.log(element.getGeometry().getCoordinates());
        // let newFeature = element.clone();
        // newFeature.getGeometry().transform(sourceProj,"EPSG:32632");
        let newFeature = element.clone();
        var polyCoords = [];
        var coords = element.getGeometry().getCoordinates();
        console.log(coords);
        newFeature.getGeometry().setCoordinates(ol.proj.transform([parseFloat(coords[0]), parseFloat(coords[1])], 'EPSG:3857', 'EPSG:32632'));
        console.log(newFeature.getGeometry().getCoordinates());
        return newFeature;
    }

    formatArea(polygon) {
        var area;
        //does'it work because our geom is Multipolygon and we need Polygon
        //  var wgs84Sphere = new ol.Sphere(6378137);
        //  var sourceProj = this.map.getView().getProjection();
        //  var geom = (polygon.clone().transform(sourceProj, 'EPSG:4326'));
        //  var polygon = new ol.geom.Polygon(geom.getCoordinates());
        //  var coordinates = geom.getLinearRing(0).getCoordinates();
        // area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        area = polygon.getArea();
        var output;
        output = (Math.round(area * 100) / 100);
        return output;
    }

    formatPerimetre(polygon) {
        var sourceProj = this.map.getView().getProjection();
        this.perimetre = 0;
        var wgs84Sphere = new ol.Sphere(6378137);
        let lastPoint = ol.proj.transform(polygon.clone().getLastCoordinate(), sourceProj, 'EPSG:4326');
        this.perimetreArray.push(lastPoint);
        for (var i = 0, ii = this.perimetreArray.length - 1; i < ii; ++i) {
            this.perimetre += wgs84Sphere.haversineDistance(this.perimetreArray[i], this.perimetreArray[i + 1]);
        }
        this.perimetre = (Math.round(this.perimetre * 100) / 100);
        return this.perimetre;
    }


    deleteLayerFromMap(layerName) {
        let style = new ol.style.Style({
            fill: new ol.style.Fill({color: "rgba(1,2,2,0)"}),
            stroke: new ol.style.Stroke({color: "rgba(1,2,2,0)"})
        });
        console.log(layerName);
        this.layersWFS_array[layerName].setStyle(style);
    }

    addLayerToMap(layerName) {
        this.layersWFS_array[layerName].setStyle(this.styles_array[layerName]);
    }
}
