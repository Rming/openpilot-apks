import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    TextInput,
    View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import NumericInput from 'react-native-numeric-input';
import Select from 'teaset/components/Select/Select';
import Theme from 'teaset/themes/Theme';
Theme.set({
    screenColor: 'rgba(0, 0, 0, 0)',
    selectBorderColor: 'rgba(0, 0, 0, 0)',
    selectBorderWidth: 0
})

import ChffrPlus from '../../native/ChffrPlus';
import UploadProgressTimer from '../../timers/UploadProgressTimer';
import { formatSize } from '../../utils/bytes';
import { mpsToKph, mpsToMph, kphToMps, mphToMps } from '../../utils/conversions';
import { Params } from '../../config';
import { resetToLaunch } from '../../store/nav/actions';


import {
    updateSshEnabled,
    updateSidebarCollapsed,
} from '../../store/host/actions';
import {
    deleteParam,
    updateParam,
    refreshParams,
} from '../../store/params/actions';

import X from '../../themes';
import Styles from './SettingsStyles';

const SettingsRoutes = {
    PRIMARY: 'PRIMARY',
    ACCOUNT: 'ACCOUNT',
    DEVICE: 'DEVICE',
    NETWORK: 'NETWORK',
    DEVELOPER: 'DEVELOPER',
}

const Icons = {
    user: require('../../img/icon_user.png'),
    developer: require('../../img/icon_shell.png'),
    warning: require('../../img/icon_warning.png'),
    metric: require('../../img/icon_metric.png'),
    network: require('../../img/icon_network.png'),
    eon: require('../../img/icon_eon.png'),
    calibration: require('../../img/icon_calibration.png'),
    speedLimit: require('../../img/icon_speed_limit.png'),
    plus: require('../../img/icon_plus.png'),
    minus: require('../../img/icon_minus.png'),
    mapSpeed: require('../../img/icon_map.png'),
    openpilot: require('../../img/icon_openpilot.png'),
    road: require('../../img/icon_road.png'),
    volume: require('../../img/icon_volume.png'),
    brightness: require('../../img/icon_brightness.png'),
    car: require('../../img/icon_car.png'),
    batteryLow: require('../../img/icon_battery_low.png'),
    nobattery: require('../../img/icon_no_batt.png'),
}


const CarModelOptions = [
    { value: '', label: '[指纹识别]'},
    { value: 'HONDA ACCORD 2018 LX 1.5T', label: '本田雅阁'},
    { value: 'HONDA ACCORD 2018 HYBRID TOURING', label: '本田雅阁混动'},
    { value: 'HONDA CIVIC 2016 TOURING', label: '本田思域'},
    { value: 'HONDA CR-V 2017 EX', label: '本田 CRV'},
    { value: 'HONDA CR-V 2019 HYBRID', label: '本田 CRV 混动'},
    { value: 'TOYOTA HIGHLANDER 2017', label: '丰田汉兰达'},
    { value: 'TOYOTA HIGHLANDER 2020', label: '丰田汉兰达(TSS2)'},
    { value: 'TOYOTA COROLLA TSS2 2019', label: '丰田卡罗拉(TSS2)'},
    { value: 'TOYOTA COROLLA HYBRID TSS2 2019', label: '丰田卡罗拉混动(TSS2)'},
    { value: 'TOYOTA RAV4 2019', label: '丰田 RAV4(TSS2)'},
    { value: 'TOYOTA RAV4 HYBRID 2019', label: '丰田 RAV4 混动(TSS2)'},
];


class Settings extends Component {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            route: SettingsRoutes.PRIMARY,
            expandedCell: null,
            version: {
                versionString: '',
                gitBranch: null,
                gitRevision: null,
            },
            speedLimitOffsetInt: '0',
            githubUsername: '',
            authKeysUpdateState: null,
        }

        this.writeSshKeys = this.writeSshKeys.bind(this);
        this.toggleExpandGithubInput = this.toggleExpandGithubInput.bind(this);
    }

    async componentWillMount() {
        UploadProgressTimer.start(this.props.dispatch);
        await this.props.refreshParams();
        const {
            isMetric,
            params: {
                SpeedLimitOffset: speedLimitOffset
            },
        } = this.props;

        if (isMetric) {
            this.setState({ speedLimitOffsetInt: parseInt(mpsToKph(speedLimitOffset)) })
        } else {
            this.setState({ speedLimitOffsetInt: parseInt(mpsToMph(speedLimitOffset)) })
        }
    }

    async componentWillUnmount() {
        await this.props.handleSidebarExpanded();
        await ChffrPlus.emitSidebarExpanded();
        UploadProgressTimer.stop();
    }

    handleExpanded(key) {
        const { expandedCell } = this.state;
        return this.setState({
            expandedCell: expandedCell == key ? null : key,
        })
    }

    handlePressedBack() {
        const { route } = this.state;
        this.props.handleSidebarExpanded();
        if (route == SettingsRoutes.PRIMARY) {
            ChffrPlus.sendBroadcast("ai.comma.plus.offroad.NAVIGATED_FROM_SETTINGS");
            this.props.navigateHome();
        } else {
            this.handleNavigatedFromMenu(SettingsRoutes.PRIMARY);
        }
    }

    handleNavigatedFromMenu(route) {
        this.setState({ route: route })
        this.refs.settingsScrollView.scrollTo({ x: 0, y: 0, animated: false })
        this.props.refreshParams();
    }

    handlePressedResetCalibration = async () => {
        this.props.deleteParam(Params.KEY_CALIBRATION_PARAMS);
        this.setState({ calibration: null });
        Alert.alert('重新启动', '重置摄像头校准需要重新启动。', [
            { text: '稍后', onPress: () => {}, style: 'cancel' },
            { text: '马上', onPress: () => ChffrPlus.reboot() },
        ]);
    }

    // handleChangedSpeedLimitOffset(operator) {
    //     const { speedLimitOffset, isMetric } = this.props;
    //     let _speedLimitOffset;
    //     let _speedLimitOffsetInt;
    //     switch (operator) {
    //       case 'increment':
    //           if (isMetric) {
    //               _speedLimitOffset = kphToMps(Math.max(Math.min(speedLimitOffsetInt + 1, 25), -15));
    //               _speedLimitOffsetInt = Math.round(mpsToKph(_speedLimitOffset));
    //           } else {
    //               _speedLimitOffset = mphToMps(Math.max(Math.min(speedLimitOffsetInt + 1, 15), -10));
    //               _speedLimitOffsetInt = Math.round(mpsToMph(_speedLimitOffset));
    //           }
    //           break;
    //       case 'decrement':
    //           if (isMetric) {
    //               _speedLimitOffset = kphToMps(Math.max(Math.min(speedLimitOffsetInt - 1, 25), -15));
    //               _speedLimitOffsetInt = Math.round(mpsToKph(_speedLimitOffset));
    //           } else {
    //               _speedLimitOffset = mphToMps(Math.max(Math.min(speedLimitOffsetInt - 1, 15), -10));
    //               _speedLimitOffsetInt = Math.round(mpsToMph(_speedLimitOffset));
    //           }
    //           break;
    //     }
    //     this.setState({ speedLimitOffsetInt: _speedLimitOffsetInt });
    //     this.props.setSpeedLimitOffset(_speedLimitOffset);
    // }

    // handleChangedIsMetric() {
    //     const { isMetric, speedLimitOffset } = this.props;
    //     const { speedLimitOffsetInt } = this.state;
    //     if (isMetric) {
    //         this.setState({ speedLimitOffsetInt: parseInt(mpsToMph(speedLimitOffset)) })
    //         this.props.setMetric(false);
    //     } else {
    //         this.setState({ speedLimitOffsetInt: parseInt(mpsToKph(speedLimitOffset)) })
    //         this.props.setMetric(true);
    //     }
    // }

    renderSettingsMenu() {
        const {
            isPaired,
            wifiState,
            simState,
            freeSpace,
            params: {
                Passive: isPassive,
                Version: version,
            },
        } = this.props;
        const software = !!parseInt(isPassive) ? 'chffrplus' : 'openpilot';
        let connectivity = 'Disconnected'
        if (wifiState.isConnected && wifiState.ssid) {
            connectivity = wifiState.ssid;
        } else if (simState.networkType && simState.networkType != 'NO SIM') {
            connectivity = simState.networkType;
        }
        const settingsMenuItems = [
            {
                icon: Icons.user,
                title: '帐户',
                context: isPaired ? '已绑定' : '未绑定',
                route: SettingsRoutes.ACCOUNT,
            },
            {
                icon: Icons.eon,
                title: '设备',
                context: `${ parseInt(freeSpace) + '%' } Free`,
                route: SettingsRoutes.DEVICE,
            },
            {
                icon: Icons.network,
                title: '网络',
                context: connectivity,
                route: SettingsRoutes.NETWORK,
            },
            {
                icon: Icons.developer,
                title: '开发人员',
                context: `${ software } v${ version.split('-')[0] }`,
                route: SettingsRoutes.DEVELOPER,
            },
        ];
        return settingsMenuItems.map((item, idx) => {
            const cellButtonStyle = [
              Styles.settingsMenuItem,
              idx == 3 ? Styles.settingsMenuItemBorderless : null,
            ]
            return (
                <View key={ idx } style={ cellButtonStyle }>
                    <X.Button
                        color='transparent'
                        size='full'
                        style={ Styles.settingsMenuItemButton }
                        onPress={ () => this.handleNavigatedFromMenu(item.route) }>
                        <X.Image
                            source={ item.icon }
                            style={ Styles.settingsMenuItemIcon } />
                        <X.Text
                            color='white'
                            size='small'
                            weight='semibold'
                            style={ Styles.settingsMenuItemTitle }>
                            { item.title }
                        </X.Text>
                        <X.Text
                            color='white'
                            size='tiny'
                            weight='light'
                            style={ Styles.settingsMenuItemContext }>
                            { item.context }
                        </X.Text>
                    </X.Button>
                </View>
            )
        })
    }

    renderPrimarySettings() {
        const {
            params: {
                RecordFront: recordFront,
                IsMetric: isMetric,
                LongitudinalControl: hasLongitudinalControl,
                LimitSetSpeed: limitSetSpeed,
                SpeedLimitOffset: speedLimitOffset,
                OpenpilotEnabledToggle: openpilotEnabled,
                Passive: isPassive,
                IsLdwEnabled: isLaneDepartureWarningEnabled,
                LaneChangeEnabled: laneChangeEnabled,

                AfaUiVolumeMultiple: uiVolumeMultiple,
                AfaUiBrightnessMultiple: uiBrightnessMultiple,
                AfaCameraOffset: cameraOffset,
                AfaCarModel: carModel,
                AfaBattPercOff: battPercOff,
                AfaNoBatMode: noBatMode,
            }
        } = this.props;
        const { expandedCell, speedLimitOffsetInt } = this.state;
        return (
            <View style={ Styles.settings }>
                <View style={ Styles.settingsHeader }>
                    <X.Button
                        color='ghost'
                        size='small'
                        onPress={ () => this.handlePressedBack() }>
                        {'<  设置'}
                    </X.Button>
                </View>
                <ScrollView
                    ref="settingsScrollView"
                    style={ Styles.settingsWindow }>
                    <X.Table direction='row' color='darkBlue'>
                        { this.renderSettingsMenu() }
                    </X.Table>
                    <X.Table color='darkBlue'>
                        { !parseInt(isPassive) ? (
                            <X.TableCell
                                type='switch'
                                title='启用 openpilot'
                                value={ !!parseInt(openpilotEnabled) }
                                iconSource={ Icons.openpilot }
                                description='使用 openpilot 的自适应巡航功能和车道保持功能，开启后您需要保持注意力集中，设置更改在重新启动车辆后生效。'
                                isExpanded={ expandedCell == 'openpilot_enabled' }
                                handleExpanded={ () => this.handleExpanded('openpilot_enabled') }
                                handleChanged={ this.props.setOpenpilotEnabled } />
                        ) : null }
                        { !parseInt(isPassive) ? (
                            <X.TableCell
                                type='switch'
                                title='启用自动变道辅助'
                                value={ !!parseInt(laneChangeEnabled) }
                                iconSource={ Icons.openpilot }
                                description='如果想切换车道，注意周边车道安全的情况下，打开转向灯，并轻轻的把方向盘推向目标车道。openpilot 无法确认周边车道是否安全，需要你自己观察确认。'
                                isExpanded={ expandedCell == 'lanechange_enabled' }
                                handleExpanded={ () => this.handleExpanded('lanechange_enabled') }
                                handleChanged={ this.props.setLaneChangeEnabled } />
                        ) : null }
                        <X.TableCell
                            type='switch'
                            title='启用车道偏离预警'
                            value={ !!parseInt(isLaneDepartureWarningEnabled) }
                            iconSource={ Icons.warning }
                            description='车速在 50 km/h 以上，且未打转向灯的情况下，如果检测到车辆驶出当前车道线时，则会发出车道偏离警告。'
                            isExpanded={ expandedCell == 'ldw' }
                            handleExpanded={ () => this.handleExpanded('ldw') }
                            handleChanged={ this.props.setLaneDepartureWarningEnabled } />
                        <X.TableCell
                            type='switch'
                            title='上传驾驶员的驾驶录像'
                            value={ !!parseInt(recordFront) }
                            iconSource={ Icons.network }
                            description='上传前置摄像头的录像来协助我们提升驾驶员监控的准确率。'
                            isExpanded={ expandedCell == 'record_front' }
                            handleExpanded={ () => this.handleExpanded('record_front') }
                            handleChanged={ this.props.setRecordFront } />
                        <X.TableCell
                            type='switch'
                            title='使用公制单位'
                            value={ !!parseInt(isMetric) }
                            iconSource={ Icons.metric }
                            description='启用后，速度会显示 km/h，否则显示 mph。'
                            isExpanded={ expandedCell == 'metric' }
                            handleExpanded={ () => this.handleExpanded('metric') }
                            handleChanged={ this.props.setMetric } />
                        <X.TableCell
                            type='switch'
                            title='启用无电池模式'
                            value={ !!parseInt(noBatMode) }
                            iconSource={ Icons.nobattery }
                            description='如果你的设备以及移除电池，可以启动此开关应用相关优化，启用后，自动禁用充电控制，禁用电池温度检测。'
                            isExpanded={ expandedCell == 'no_bat_mode' }
                            handleExpanded={ () => this.handleExpanded('no_bat_mode') }
                            handleChanged={ this.props.setNoBatMode } />
                        <X.TableCell
                            type='custom'
                            title='媒体音量'
                            iconSource={ Icons.volume }
                            description='对设备的提示音量大小进行调整，设置为 0 时为静音模式，音量值最大为 100，修改后立即生效。'
                            isExpanded={ expandedCell == 'ui_volume_multiple' }
                            handleExpanded={ () => this.handleExpanded('ui_volume_multiple') }>
                            <NumericInput
                                value={ parseInt(uiVolumeMultiple) }
                                onChange={multiple => this.props.setUiVolumeMultiple(multiple)}
                                onFocus={() => this.props.handleSidebarCollapsed()}
                                onBlur={() => this.props.handleSidebarExpanded()}
                                totalWidth={120}
                                totalHeight={40}
                                iconSize={25}
                                minValue={0}
                                maxValue={100}
                                step={20}
                                valueType='integer'
                                rounded
                                borderColor="transparent"
                                textColor='#96b4c8'
                                iconStyle={{ color: '#FFFFFF'}}
                                reachMaxIncIconStyle={{color: '#777777'}}
                                reachMinDecIconStyle={{color: '#777777'}}
                                rightButtonBackgroundColor='transparent'
                                leftButtonBackgroundColor='transparent'/>
                        </X.TableCell>

                        <X.TableCell
                            type='custom'
                            title='屏幕亮度'
                            iconSource={ Icons.brightness }
                            description='对设备的屏幕亮度进行调整，默认值为 100，设置值可以超过 100，设置为 0 时不会息屏，修改后立即生效。'
                            isExpanded={ expandedCell == 'ui_brightness_multiple' }
                            handleExpanded={ () => this.handleExpanded('ui_brightness_multiple') }>
                            <NumericInput
                                value={ parseInt(uiBrightnessMultiple) }
                                onChange={multiple => this.props.setUiBrightnessMultiple(multiple)}
                                onFocus={() => this.props.handleSidebarCollapsed()}
                                onBlur={() => this.props.handleSidebarExpanded()}
                                totalWidth={120}
                                totalHeight={40}
                                iconSize={25}
                                minValue={0}
                                maxValue={1000}
                                step={10}
                                valueType='integer'
                                rounded
                                borderColor="transparent"
                                textColor='#96b4c8'
                                iconStyle={{ color: '#FFFFFF'}}
                                reachMaxIncIconStyle={{color: '#777777'}}
                                reachMinDecIconStyle={{color: '#777777'}}
                                rightButtonBackgroundColor='transparent'
                                leftButtonBackgroundColor='transparent'/>
                        </X.TableCell>

                        <X.TableCell
                            type='custom'
                            title='相机偏移'
                            iconSource={ Icons.road }
                            description='如果 EON 不是固定在汽车挡风玻璃正中间，那么需要调整这个相机偏移量（默认 6 cm），如果相机在汽车左侧、或者行驶过程中车辆偏向右侧车道线，则增加偏移，否则需要减少偏移，修改配置重启后生效。'
                            isExpanded={ expandedCell == 'camera_offset' }
                            handleExpanded={ () => this.handleExpanded('camera_offset') }>
                            <NumericInput
                                value={ parseInt(cameraOffset) }
                                onChange={offset => this.props.setCameraOffset(offset)}
                                onFocus={() => this.props.handleSidebarCollapsed()}
                                onBlur={() => this.props.handleSidebarExpanded()}
                                totalWidth={120}
                                totalHeight={40}
                                iconSize={25}
                                step={1}
                                valueType='integer'
                                rounded
                                borderColor="transparent"
                                textColor='#96b4c8'
                                iconStyle={{ color: '#FFFFFF' }}
                                reachMaxIncIconStyle={{color: '#777777'}}
                                reachMinDecIconStyle={{color: '#777777'}}
                                rightButtonBackgroundColor='transparent'
                                leftButtonBackgroundColor='transparent'/>
                        </X.TableCell>


                        <X.TableCell
                            type='custom'
                            title='低电量关机'
                            iconSource={ Icons.batteryLow }
                            description='驾驶结束时，监控设备电量低于设置百分比，且没有在充电，则在 60 秒后自动关机，修改配置重启后生效。'
                            isExpanded={ expandedCell == 'ui_battery_low' }
                            handleExpanded={ () => this.handleExpanded('ui_battery_low') }>
                            <NumericInput
                                value={ parseInt(battPercOff) }
                                onChange={perc => this.props.setBattPercOff(perc)}
                                onFocus={() => this.props.handleSidebarCollapsed()}
                                onBlur={() => this.props.handleSidebarExpanded()}
                                totalWidth={120}
                                totalHeight={40}
                                iconSize={25}
                                minValue={10}
                                maxValue={100}
                                step={10}
                                valueType='integer'
                                rounded
                                borderColor="transparent"
                                textColor='#96b4c8'
                                iconStyle={{ color: '#FFFFFF'}}
                                reachMaxIncIconStyle={{color: '#777777'}}
                                reachMinDecIconStyle={{color: '#777777'}}
                                rightButtonBackgroundColor='transparent'
                                leftButtonBackgroundColor='transparent'/>
                        </X.TableCell>

                        <X.TableCell
                            type='custom'
                            title='车型选择'
                            iconSource={ Icons.car }
                            description='[实验性功能]强制设置车辆为指定车型，不再通过车辆指纹、VIN 识别，如果想重新启用指纹识别，请选择指纹识别选项。'
                            isExpanded={ expandedCell == 'car_model' }
                            handleExpanded={ () => this.handleExpanded('car_model') }>
                            <Select
                              style={{width: 120, backgroundColor: '#efefef'}}
                              iconTintColor='#777777'
                              valueStyle={{flex: 1, color: '#777777', textAlign: 'center'}}
                              value={ carModel }
                              items={ CarModelOptions }
                              pickerType="popover"
                              getItemValue={(item, index) => item.value}
                              getItemText={(item, index) => item.label}
                              placeholder='选择车型'
                              onSelected={(item, index) => this.props.setCarModel(item.value)}
                              />
                        </X.TableCell>



                      </X.Table>
                      {/*
                      <X.Table color='darkBlue'>
                        <X.TableCell
                            type='custom'
                            title='速限补偿'
                            iconSource={ Icons.speedLimit }
                            description='当设备从地图读到路段速限时，您可以利用速限补偿来微调定速 (单位是 km/h 或 mph)'
                            isExpanded={ expandedCell == 'speedLimitOffset' }
                            handleExpanded={ () => this.handleExpanded('speedLimitOffset') }
                            handleChanged={ this.props.setLimitSetSpeed }>
                            <X.Button
                                color='ghost'
                                activeOpacity={ 1 }
                                style={ Styles.settingsSpeedLimitOffset }>
                                <X.Button
                                    style={ [Styles.settingsNumericButton, { opacity: speedLimitOffsetInt == (isMetric ? -15 : -10) ? 0.1 : 0.8 }] }
                                    onPress={ () => this.handleChangedSpeedLimitOffset('decrement')  }>
                                    <X.Image
                                        source={ Icons.minus }
                                        style={ Styles.settingsNumericIcon } />
                                </X.Button>
                                <X.Text
                                    color='white'
                                    weight='semibold'
                                    style={ Styles.settingsNumericValue }>
                                    { speedLimitOffsetInt }
                                </X.Text>
                                <X.Button
                                    style={ [Styles.settingsNumericButton, { opacity: speedLimitOffsetInt == (isMetric ? 25 : 15) ? 0.1 : 0.8 }] }
                                    onPress={ () => this.handleChangedSpeedLimitOffset('increment') }>
                                    <X.Image
                                        source={ Icons.plus }
                                        style={ Styles.settingsNumericIcon } />
                                </X.Button>
                            </X.Button>
                        </X.TableCell>
                        <X.TableCell
                            type='switch'
                            title='Use Map To Control Vehicle Speed'
                            value={ !!parseInt(limitSetSpeed) }
                            isDisabled={ !parseInt(hasLongitudinalControl) }
                            iconSource={ Icons.mapSpeed }
                            description='使用地图来控制当前的车速。当您见到一个弯道图示时，代表车辆将会自动减速来过前方的弯道。当取得地图数据后，车速将被限制在地图上的速限 (外加速限补偿设置)。这功能需要有网络连接以及能让 openpilot 横向控制的对应车种。当图资下载完成后，您将会看到一个地图图示。'
                            isExpanded={ expandedCell == 'limitSetSpeed' }
                            handleExpanded={ () => this.handleExpanded('limitSetSpeed') }
                            handleChanged={ this.props.setLimitSetSpeed } />
                    </X.Table>
                    */}
                    <X.Table color='darkBlue'>
                        <X.Button
                            color='settingsDefault'
                            onPress={ () => this.props.openTrainingGuide() }>
                            查看使用教程
                        </X.Button>
                    </X.Table>
                </ScrollView>
            </View>
        )
    }

    renderAccountSettings() {
        const { isPaired } = this.props;
        const { expandedCell } = this.state;
        return (
            <View style={ Styles.settings }>
                <View style={ Styles.settingsHeader }>
                    <X.Button
                        color='ghost'
                        size='small'
                        onPress={ () => this.handlePressedBack() }>
                        {'<  帐户设置'}
                    </X.Button>
                </View>
                <ScrollView
                    ref="settingsScrollView"
                    style={ Styles.settingsWindow }>
                    <View>
                        <X.Table>
                            <X.TableCell
                                title='帐户绑定'
                                value={ isPaired ? 'Yes' : 'No' } />
                            { isPaired ? (
                                <X.Text
                                    color='white'
                                    size='tiny'>
                                    您可以在手机应用（comma connect）中解绑设备。
                                </X.Text>
                            ) : null }
                            <X.Line color='light' />
                            <X.Text
                                color='white'
                                size='tiny'>
                                服务条款请参阅 {'https://my.comma.ai/terms.html'}
                            </X.Text>
                        </X.Table>
                        { isPaired ? null : (
                            <X.Table color='darkBlue' padding='big'>
                                <X.Button
                                    color='settingsDefault'
                                    size='small'
                                    onPress={ this.props.openPairing }>
                                    绑定帐户
                                </X.Button>
                            </X.Table>
                        ) }
                    </View>
                </ScrollView>
            </View>
        )
    }

    renderDeviceSettings() {
        const {
            expandedCell,
        } = this.state;

        const {
            serialNumber,
            txSpeedKbps,
            freeSpace,
            isPaired,
            params: {
                DongleId: dongleId,
                Passive: isPassive,
            },
        } = this.props;
        const software = !!parseInt(isPassive) ? 'chffrplus' : 'openpilot';
        return (
            <View style={ Styles.settings }>
                <View style={ Styles.settingsHeader }>
                    <X.Button
                        color='ghost'
                        size='small'
                        onPress={ () => this.handlePressedBack() }>
                        {'<  设备设置'}
                    </X.Button>
                </View>
                <ScrollView
                    ref="settingsScrollView"
                    style={ Styles.settingsWindow }>
                    <X.Table color='darkBlue'>
                        <X.TableCell
                            type='custom'
                            title='摄像头校准'
                            iconSource={ Icons.calibration }
                            description='摄像头是一直在后台自动校准的，只有当您的设备提示校准无效或者您将设备安装至不同的车辆/位置时，才需要重新校准。'
                            isExpanded={ expandedCell == 'calibration' }
                            handleExpanded={ () => this.handleExpanded('calibration') }>
                            <X.Button
                                size='tiny'
                                color='settingsDefault'
                                onPress={ this.handlePressedResetCalibration  }
                                style={ { minWidth: '100%' } }>
                                重新校准
                            </X.Button>
                        </X.TableCell>
                    </X.Table>
                    <X.Table>
                        <X.TableCell
                            title='已绑定'
                            value={ isPaired ? 'Yes' : 'No' } />
                        <X.TableCell
                            title='Dongle ID'
                            value={ dongleId } />
                        <X.TableCell
                            title='序列号'
                            value={ serialNumber } />
                        <X.TableCell
                            title='剩余空间'
                            value={ parseInt(freeSpace) + '%' }
                             />
                        <X.TableCell
                            title='上传速度'
                            value={ txSpeedKbps + ' kbps' }
                             />
                    </X.Table>
                    <X.Table color='darkBlue'>
                        <X.Button
                            size='small'
                            color='settingsDefault'
                            onPress={ () => this.props.reboot() }>
                            重新启动
                        </X.Button>
                        <X.Line color='transparent' size='tiny' spacing='mini' />
                        <X.Button
                            size='small'
                            color='settingsDefault'
                            onPress={ () => this.props.shutdown() }>
                            关机
                        </X.Button>
                    </X.Table>
                </ScrollView>
            </View>
        )
    }

    renderNetworkSettings() {
        const { expandedCell } = this.state;
        return (
            <View style={ Styles.settings }>
                <View style={ Styles.settingsHeader }>
                    <X.Button
                        color='ghost'
                        size='small'
                        onPress={ () => this.handlePressedBack() }>
                        {'<  网络设置'}
                    </X.Button>
                </View>
                <ScrollView
                    ref="settingsScrollView"
                    style={ Styles.settingsWindow }>
                    <X.Line color='transparent' spacing='tiny' />
                    <X.Table spacing='big' color='darkBlue'>
                        <X.Button
                            size='small'
                            color='settingsDefault'
                            onPress={ this.props.openWifiSettings }>
                            无线网络设置
                        </X.Button>
                        <X.Line color='transparent' size='tiny' spacing='mini' />
                        <X.Button
                            size='small'
                            color='settingsDefault'
                            onPress={ this.props.openTetheringSettings }>
                            共享网络设置
                        </X.Button>
                    </X.Table>
                </ScrollView>
            </View>
        )
    }

    renderDeveloperSettings() {
        const {
            isSshEnabled,
            params: {
                Version: version,
                GitBranch: gitBranch,
                GitCommit: gitRevision,
                Passive: isPassive,
                PandaFirmwareHex: pandaFirmwareHex,
                PandaDongleId: pandaDongleId,
                CommunityFeaturesToggle: communityFeatures,
            },
        } = this.props;
        const { expandedCell } = this.state;
        const software = !!parseInt(isPassive) ? 'chffrplus' : 'openpilot';
        return (
            <View style={ Styles.settings }>
                <View style={ Styles.settingsHeader }>
                    <X.Button
                        color='ghost'
                        size='small'
                        onPress={ () => this.handlePressedBack() }>
                        {'<  开发人员设置'}
                    </X.Button>
                </View>
                <ScrollView
                    ref="settingsScrollView"
                    style={ Styles.settingsWindow }>
                    <X.Table color='darkBlue'>
                        <X.TableCell
                            type='switch'
                            title='启用社区功能'
                            value={ !!parseInt(communityFeatures) }
                            iconSource={ Icons.developer }
                            descriptionExtra={
                              <X.Text color='white' size='tiny'>
                                  使用来自开源社区开发维护的功能（未通过官方标准安全验证）{'\n'}
                                  * 通用车型支持{'\n'}
                                  * 丰田车型支持断开 DSU 模块{'\n'}
                                  * 油门踏板拦截器支持{'\n'}
                              </X.Text>
                            }
                            isExpanded={ expandedCell == 'communityFeatures' }
                            handleExpanded={ () => this.handleExpanded('communityFeatures') }
                            handleChanged={ this.props.setCommunityFeatures } />
                        <X.TableCell
                            type='switch'
                            title='启用 SSH'
                            value={ isSshEnabled }
                            iconSource={ Icons.developer }
                            description='允许别的设备通过 Secure Shell (SSH) 连接至您的设备。'
                            isExpanded={ expandedCell == 'ssh' }
                            handleExpanded={ () => this.handleExpanded('ssh') }
                            handleChanged={ this.props.setSshEnabled } />
                        <X.TableCell
                            iconSource={ Icons.developer }
                            title='授权 SSH 密钥'
                            descriptionExtra={ this.renderSshInput() }
                            isExpanded={ expandedCell === 'ssh_keys' }
                            handleExpanded={ this.toggleExpandGithubInput }
                            type='custom'>
                            <X.Button
                                size='tiny'
                                color='settingsDefault'
                                onPress={ this.toggleExpandGithubInput }
                                style={ { minWidth: '100%' } }>
                                { expandedCell === 'ssh_keys' ? '取消' : '编辑' }
                            </X.Button>
                        </X.TableCell>
                    </X.Table>
                    <X.Table spacing='none'>
                        <X.TableCell
                            title='版本'
                            value={ `${ software } v${ version }` } />
                        <X.TableCell
                            title='Git 分支'
                            value={ gitBranch } />
                        <X.TableCell
                            title='Git 修订版'
                            value={ gitRevision.slice(0, 12) }
                            valueTextSize='tiny' />
                        <X.TableCell
                            title='Panda 固件'
                            value={ pandaFirmwareHex != null ? pandaFirmwareHex : 'N/A' }
                            valueTextSize='tiny' />
                        <X.TableCell
                            title='Panda Dongle ID'
                            value={ (pandaDongleId != null && pandaDongleId != "unprovisioned") ? pandaDongleId : 'N/A' }
                            valueTextSize='tiny' />
                    </X.Table>
                    <X.Table color='darkBlue' padding='big'>
                        <X.Button
                            color='settingsDefault'
                            size='small'
                            onPress={ this.props.uninstall }>
                            { `卸载 ${ software }` }
                        </X.Button>
                    </X.Table>
                </ScrollView>
            </View>
        )
    }


    renderSshInput() {
        let { githubUsername, authKeysUpdateState } = this.state;
        let githubUsernameIsValid = githubUsername.match(/[a-zA-Z0-9-]+/) !== null;

        return (
            <View>
                <X.Text color='white' size='tiny'>
                    警告：{'\n'}这个功能会同步 Github 设置里所有公钥的 SSH 访问权限，请不要输入别人的 Github 用户名（即使声称是 comma 的员工），操作完成后，原先内置的 SSH 密钥会被禁用。




                </X.Text>
                <View style={ Styles.githubUsernameInputContainer }>
                    <X.Text
                        color='white'
                        weight='semibold'
                        size='small'
                        style={ Styles.githubUsernameInputLabel }>
                        GitHub 用户名
                    </X.Text>
                    <TextInput
                        style={ Styles.githubUsernameInput }
                        onChangeText={ (text) => this.setState({ githubUsername: text, authKeysUpdateState: null })}
                        value={ githubUsername }
                        ref={ ref => this.githubInput = ref }
                        underlineColorAndroid='transparent'
                    />
                </View>
                <View>
                    <X.Button
                        size='tiny'
                        color='settingsDefault'
                        isDisabled={ !githubUsernameIsValid }
                        onPress={ this.writeSshKeys }
                        style={ Styles.githubUsernameSaveButton }>
                        <X.Text color='white' size='small' style={ Styles.githubUsernameInputSave }>
                        保存
                        </X.Text>
                    </X.Button>
                    { authKeysUpdateState !== null &&
                        <View style={ Styles.githubUsernameInputStatus }>
                            { authKeysUpdateState === 'inflight' &&
                                <ActivityIndicator
                                    color='white'
                                    refreshing={ true }
                                    size={ 37 }
                                    style={ Styles.connectingIndicator } />
                            }
                            { authKeysUpdateState === 'failed' &&
                                <X.Text color='white' size='tiny'>Save failed. Ensure that your username is correct and you are connected to the internet.</X.Text>
                            }
                        </View>
                    }
                    <View style={ Styles.githubSshKeyClearContainer }>
                        <X.Button
                            size='tiny'
                            color='settingsDefault'
                            onPress={ this.clearSshKeys }
                            style={ Styles.githubUsernameSaveButton }>
                            <X.Text color='white' size='small' style={ Styles.githubUsernameInputSave }>
                            全部删除
                            </X.Text>
                        </X.Button>
                    </View>
                </View>
            </View>
        );
    }

    toggleExpandGithubInput() {
        this.setState({ authKeysUpdateState: null });
        this.handleExpanded('ssh_keys');
    }

    clearSshKeys() {
        ChffrPlus.resetSshKeys();
    }

    async writeSshKeys() {
        let { githubUsername } = this.state;

        try {
            this.setState({ authKeysUpdateState: 'inflight' })
            const resp = await fetch(`https://github.com/${githubUsername}.keys`);
            const githubKeys = (await resp.text());
            if (resp.status !== 200) {
                throw new Error('Non-200 response code from GitHub');
            }

            await ChffrPlus.writeParam(Params.KEY_GITHUB_SSH_KEYS, githubKeys);
            this.toggleExpandGithubInput();
        } catch(err) {
            console.log(err);
            this.setState({ authKeysUpdateState: 'failed' });
        }
    }

    renderSettingsByRoute() {
        const { route } = this.state;
        switch (route) {
            case SettingsRoutes.PRIMARY:
                return this.renderPrimarySettings();
            case SettingsRoutes.ACCOUNT:
                return this.renderAccountSettings();
            case SettingsRoutes.DEVICE:
                return this.renderDeviceSettings();
            case SettingsRoutes.NETWORK:
                return this.renderNetworkSettings();
            case SettingsRoutes.DEVELOPER:
                return this.renderDeveloperSettings();
        }
    }

    render() {
        return (
            <X.Gradient color='dark_blue'>
                { this.renderSettingsByRoute() }
            </X.Gradient>
        )
    }
}

const mapStateToProps = state => ({
    isSshEnabled: state.host.isSshEnabled,
    serialNumber: state.host.serial,
    simState: state.host.simState,
    wifiState: state.host.wifiState,
    isPaired: state.host.device && state.host.device.is_paired,

    // Uploader
    txSpeedKbps: parseInt(state.uploads.txSpeedKbps),
    freeSpace: state.host.thermal.freeSpace,

    params: state.params.params,
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    navigateHome: async () => {
        await dispatch(updateSidebarCollapsed(false));
        await dispatch(resetToLaunch());
        await ChffrPlus.emitHomePress();
    },
    openPairing: () => {
        dispatch(NavigationActions.navigate({ routeName: 'SetupQr' }));
    },
    openWifiSettings: async () => {
        await dispatch(updateSidebarCollapsed(true));
        await dispatch(NavigationActions.navigate({ routeName: 'SettingsWifi' }));
        ChffrPlus.emitSidebarCollapsed();
    },
    openTetheringSettings: async () => {
        await dispatch(updateSidebarCollapsed(true));
        ChffrPlus.emitSidebarCollapsed();
        ChffrPlus.openTetheringSettings();
    },
    reboot: () => {
        Alert.alert('重新启动', '您确定要重新启动吗?', [
            { text: '取消', onPress: () => {}, style: 'cancel' },
            { text: '重新启动', onPress: () => ChffrPlus.reboot() },
        ]);
    },
    shutdown: () => {
        Alert.alert('关机', '您确定要关机吗?', [
            { text: '取消', onPress: () => {}, style: 'cancel' },
            { text: '关机', onPress: () => ChffrPlus.shutdown() },
        ]);
    },
    uninstall: () => {
        Alert.alert('卸载', '您确定要卸载吗?', [
            { text: '取消', onPress: () => {}, style: 'cancel' },
            { text: '卸载', onPress: () => ChffrPlus.writeParam(Params.KEY_DO_UNINSTALL, "1") },
        ]);
    },
    openTrainingGuide: () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Onboarding' })
            ]
        }))
    },
    setOpenpilotEnabled: (openpilotEnabled) => {
        dispatch(updateParam(Params.KEY_OPENPILOT_ENABLED, (openpilotEnabled | 0).toString()));
    },
    setMetric: (useMetricUnits) => {
        dispatch(updateParam(Params.KEY_IS_METRIC, (useMetricUnits | 0).toString()));
    },
    setRecordFront: (recordFront) => {
        dispatch(updateParam(Params.KEY_RECORD_FRONT, (recordFront | 0).toString()));
    },
    setSshEnabled: (isSshEnabled) => {
        dispatch(updateSshEnabled(!!isSshEnabled));
    },
    setHasLongitudinalControl: (hasLongitudinalControl) => {
        dispatch(updateParam(Params.KEY_HAS_LONGITUDINAL_CONTROL, (hasLongitudinalControl | 0).toString()));
    },
    setLimitSetSpeed: (limitSetSpeed) => {
        dispatch(updateParam(Params.KEY_LIMIT_SET_SPEED, (limitSetSpeed | 0).toString()));
    },
    setSpeedLimitOffset: (speedLimitOffset) => {
        dispatch(updateParam(Params.KEY_SPEED_LIMIT_OFFSET, (speedLimitOffset).toString()));
    },
    setCommunityFeatures: (communityFeatures) => {
        if (communityFeatures == 1) {
            Alert.alert('启用社区功能', '开源社区开发维护的功能，未通过官方标准安全验证，请谨慎使用。', [
                { text: '取消', onPress: () => {}, style: 'cancel' },
                { text: '确定', onPress: () => {
                    dispatch(updateParam(Params.KEY_COMMUNITY_FEATURES, (communityFeatures | 0).toString()));
                } },
            ]);
        } else {
            dispatch(updateParam(Params.KEY_COMMUNITY_FEATURES, (communityFeatures | 0).toString()));
        }
    },
    setLaneDepartureWarningEnabled: (isLaneDepartureWarningEnabled) => {
        dispatch(updateParam(Params.KEY_LANE_DEPARTURE_WARNING_ENABLED, (isLaneDepartureWarningEnabled | 0).toString()));
    },
    setNoBatMode: (noBatMode) => {
        dispatch(updateParam(Params.KEY_NO_BAT_MODE, (noBatMode | 0).toString()));
    },
    setUiVolumeMultiple: (multiple) => {
        dispatch(updateParam(Params.KEY_UI_VOLUME_MULTIPLE, (multiple).toString()));
    },
    setUiBrightnessMultiple: (multiple) => {
        dispatch(updateParam(Params.KEY_UI_BRIGHTNESS_MULTIPLE, (multiple).toString()));
    },
    setCameraOffset: (offset) => {
        dispatch(updateParam(Params.KEY_CAMERA_OFFSET, (offset).toString()));
    },
    setBattPercOff: (perc) => {
        dispatch(updateParam(Params.KEY_BATT_PERC_OFF, (perc).toString()));
    },
    setCarModel: (model) => {
        dispatch(updateParam(Params.KEY_CAR_MODEL, (model).toString()));
    },
    setLaneChangeEnabled: (laneChangeEnabled) => {
        dispatch(updateParam(Params.KEY_LANE_CHANGE_ENABLED, (laneChangeEnabled | 0).toString()));
    },
    deleteParam: (param) => {
        dispatch(deleteParam(param));
    },
    refreshParams: () => {
        dispatch(refreshParams());
    },
    handleSidebarCollapsed: async () => {
        await dispatch(updateSidebarCollapsed(true));
        ChffrPlus.emitSidebarCollapsed();
    },
    handleSidebarExpanded: async () => {
        await dispatch(updateSidebarCollapsed(false));
        ChffrPlus.emitSidebarExpanded();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
