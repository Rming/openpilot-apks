import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import Layout from '../../../native/Layout';
import { completeTrainingStep } from '../step';
import { onTrainingRouteCompleted } from '../../../utils/version';

import X from '../../../themes';
import Styles from './OnboardingStyles';

const Step = {
    OB_SPLASH: 'OB_SPLASH',
    OB_INTRO: 'OB_INTRO',
    OB_SENSORS: 'OB_SENSORS',
    OB_ENGAGE: 'OB_ENGAGE',
    OB_LANECHANGE: 'OB_LANECHANGE',
    OB_DISENGAGE: 'OB_DISENGAGE',
    OB_OUTRO: 'OB_OUTRO',
};

class Onboarding extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            step: Step.OB_SPLASH,
            stepPoint: 0,
            stepChecks: [],
            engagedMocked: false,
            photoOffset: new Animated.Value(0),
            photoCycled: new Animated.Value(0),
            photoCycledLast: new Animated.Value(0),
            leadEntered: new Animated.Value(0),
            gateHighlighted: new Animated.Value(0),
        };
    }

    componentWillMount() {
        this.handleEngagedMocked(false);
    }

    componentWillUnmount() {
        this.handleEngagedMocked(false);
    }

    setStep(step) {
        this.setState({
            step: '',
            stepChecks: [],
        }, () => {
            return this.setState({ step });
        });
    }

    setStepPoint(stepPoint) {
        this.setState({
            stepPoint: 0,
        }, () => {
            return this.setState({ stepPoint });
        })
    }

    handleRestartPressed = () => {
        this.props.restartTraining();
        this.setStep('OB_SPLASH');
    }

    handleIntroCheckboxPressed(stepCheck) {
        const { stepChecks } = this.state;
        if (stepChecks.indexOf(stepCheck) === -1) {
            const newStepChecks = [...stepChecks, stepCheck];
            this.setState({ stepChecks: newStepChecks });
            if (newStepChecks.length == 3) {
                setTimeout(() => {
                    this.setStep('OB_SENSORS');
                }, 300)
            }
        } else {
            stepChecks.splice(stepChecks.indexOf(stepCheck), 1);
            this.setState({ stepChecks });
        }
    }

    handleSensorRadioPressed(option) {
        switch(option) {
            case 'index':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                return this.setStepPoint(0); break;
            case 'camera':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(0);
                return this.setStepPoint(1); break;
            case 'radar':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animateLeadEntered(100);
                return this.setStepPoint(2); break;
        }
    }

    handleEngageRadioPressed(option) {
        switch(option) {
            case 'index':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                return this.setStepPoint(0); break;
            case 'cruise':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(0);
                return this.setStepPoint(1); break;
            case 'monitoring':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                return this.setStepPoint(2); break;
        }
    }

    handleLaneChangeRadioPressed(option) {
        switch(option) {
            case 'index':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                return this.setStepPoint(0); break;
            case 'start':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                return this.setStepPoint(1); break;
            case 'perform':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(0);
                return this.setStepPoint(2); break;
        }
    }

    handleDisengageRadioPressed(option) {
        switch(option) {
            case 'index':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                return this.setStepPoint(0); break;
            case 'limitations':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(0);
                return this.setStepPoint(1); break;
            case 'disengage':
                this.animatePhotoOffset(100);
                this.animatePhotoCycledLast(100);
                return this.setStepPoint(2); break;
        }
    }

    handleSensorVisualPressed(visual) {
        const { stepChecks } = this.state;
        const hasCheck = (stepChecks.indexOf(visual) > -1);
        if (stepChecks.length > 0 && !hasCheck) {
            this.animatePhotoOffset(0);
            this.setState({ stepChecks: [...stepChecks, visual] });
            this.setStepPoint(0);
            return this.setStep('OB_ENGAGE');
        } else {
            this.setState({ stepChecks: [...stepChecks, visual] });
            switch(visual) {
                case 'camera':
                    this.animatePhotoCycled(100);
                    this.animateLeadEntered(100);
                    return this.setStepPoint(2); break;
                case 'radar':
                    this.animatePhotoOffset(0);
                    this.animateLeadEntered(0);
                    this.animatePhotoCycled(0);
                    this.setStepPoint(0);
                    return this.setStep('OB_ENGAGE'); break;
            }
        }
    }

    handleEngageVisualPressed(visual) {
        const { stepChecks } = this.state;
        const hasCheck = (stepChecks.indexOf(visual) > -1);
        this.setState({ stepChecks: [...stepChecks, visual] });
        switch(visual) {
            case 'cruise':
                this.animatePhotoCycled(100);
                this.handleEngagedMocked(true);
                return this.setStepPoint(2); break;
            case 'monitoring':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(100);
                this.setStepPoint(0);
                return this.setStep('OB_LANECHANGE'); break;
        }
    }

    handleLaneChangeVisualPressed(visual) {
        const { stepChecks } = this.state;
        const hasCheck = (stepChecks.indexOf(visual) > -1);
        this.setState({ stepChecks: [...stepChecks, visual] });
        switch(visual) {
            case 'start':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(100);
                return this.setStepPoint(2); break;
            case 'perform':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(100);
                this.setStepPoint(0);
                return this.setStep('OB_DISENGAGE'); break;
        }
    }

    handleDisengageVisualPressed(visual) {
        const { stepChecks } = this.state;
        const hasCheck = (stepChecks.indexOf(visual) > -1);
        this.setState({ stepChecks: [...stepChecks, visual] });
        switch(visual) {
            case 'limitations':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(100);
                return this.setStepPoint(2); break;
            case 'disengage':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                this.handleEngagedMocked(false);
                this.setStepPoint(0);
                return this.setStep('OB_OUTRO'); break;
        }
    }

    animatePhotoOffset(offset) {
        const { photoOffset } = this.state;
        Animated.timing(
            photoOffset,
            {
                toValue: offset,
                duration: 1000,
            }
        ).start();
    }

    animatePhotoCycled(offset) {
        const { photoCycled } = this.state;
        Animated.timing(
            photoCycled,
            {
                toValue: offset,
                duration: 800,
            }
        ).start();
    }

    animatePhotoCycledLast(offset) {
        const { photoCycledLast } = this.state;
        Animated.timing(
            photoCycledLast,
            {
                toValue: offset,
                duration: 800,
            }
        ).start();
    }

    animateLeadEntered(offset) {
        const { leadEntered } = this.state;
        Animated.timing(
            leadEntered,
            {
                toValue: offset,
                duration: 500,
            }
        ).start();
    }

    animateTouchGateHighlighted(amount) {
        const { gateHighlighted } = this.state;
        Animated.sequence([
          Animated.timing(
            gateHighlighted,
            {
              toValue: amount,
              duration: 300,
            }
          ),
          Animated.timing(
              gateHighlighted,
              {
                  toValue: 0,
                  duration: 500,
              }
          )
        ]).start()
    }

    handleWrongGatePressed() {
        this.animateTouchGateHighlighted(50);
    }

    handleEngagedMocked(shouldMock) {
        this.setState({ engagedMocked: shouldMock })
        Layout.setMockEngaged(shouldMock);
    }

    renderSplashStep() {
        return (
            <X.Entrance style={ Styles.onboardingSplashView }>
                <X.Text
                    size='jumbo' color='white' weight='bold'
                    style={ Styles.onboardingStepHeader }>
                    欢迎使用 openpilot 测试版
                </X.Text>
                <X.Text
                    color='white' weight='light'
                    style={ Styles.onboardingStepContext }>
                    现在，您已经完成了所有设置，在测试使用之前，了解 openpilot 测试版的功能限制非常重要。
                </X.Text>
                <View style={ Styles.onboardingPrimaryAction }>
                    <X.Button
                        color='setupPrimary'
                        onPress={ () => this.setStep('OB_INTRO') }>
                        开始教程
                    </X.Button>
                </View>
            </X.Entrance>
        )
    }

    renderIntroStep() {
        const { stepChecks } = this.state;
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                <View style={ Styles.onboardingStepPoint }>
                    <View style={ Styles.onboardingStepPointChain }>
                        <X.Button
                            size='small' color='ghost'
                            style={ Styles.onboardingStepPointChainPrevious }
                            onPress={ () => this.setStep('OB_SPLASH') }>
                            <X.Image
                                source={ require('../../../img/icon_chevron_right.png') }
                                style={ Styles.onboardingStepPointChainPreviousIcon } />
                        </X.Button>
                        <View style={ Styles.onboardingStepPointChainNumber }>
                            <X.Text color='white' weight='semibold'>
                                1
                            </X.Text>
                        </View>
                    </View>
                    <View style={ Styles.onboardingStepPointBody }>
                        <X.Text size='bigger' color='white' weight='bold'>
                            openpilot 是一个高级驾驶辅助系统。
                        </X.Text>
                        <X.Text
                            size='smallish' color='white' weight='light'
                            style={ Styles.onboardingStepContextSmall }>
                            驾驶辅助系统不是自动驾驶系统，意味着 openpilot 需要配合你一起工作，而不是独立自主运行，驾驶时，您仍然需要注意行车安全。
                        </X.Text>
                        <X.CheckboxField
                            size='small'
                            color='white'
                            isChecked={ stepChecks.includes(1) }
                            onPress={ () => this.handleIntroCheckboxPressed(1) }
                            label='我会保持关注路况。' />
                        <X.CheckboxField
                            size='small'
                            color='white'
                            isChecked={ stepChecks.includes(2) }
                            onPress={ () => this.handleIntroCheckboxPressed(2) }
                            label='我会准备好随时接管控制。' />
                        <X.CheckboxField
                            size='small'
                            color='white'
                            isChecked={ stepChecks.includes(3) }
                            onPress={ () => this.handleIntroCheckboxPressed(3) }
                            label='我一定会准备好随时接管控制!' />
                    </View>
                </View>
            </X.Entrance>
        )
    }

    renderSensorsStepPointIndex() {
        const { stepChecks } = this.state;
        return (
            <View style={ Styles.onboardingStepPoint }>
                <View style={ Styles.onboardingStepPointChain }>
                    <X.Button
                        size='small' color='ghost'
                        style={ Styles.onboardingStepPointChainPrevious }
                        onPress={ () => this.setStep('OB_INTRO') }>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointChainPreviousIcon } />
                    </X.Button>
                    <View style={ Styles.onboardingStepPointChainNumber }>
                        <X.Text color='white' weight='semibold'>
                            2
                        </X.Text>
                    </View>
                </View>
                <View style={ Styles.onboardingStepPointBody }>
                    <X.Text size='bigger' color='white' weight='bold'>
                        openpilot 使用多个传感器来检测前方道路。
                    </X.Text>
                    <X.Text
                        size='smallish' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmall }>
                        我们把这些传感器信息融合在一起，构建出前方道路状况，然后才会向车辆发送控制信息。
                    </X.Text>
                    <X.RadioField
                        size='big'
                        color='white'
                        isChecked={ stepChecks.includes('camera') }
                        hasAppend={ true }
                        onPress={ () => this.handleSensorRadioPressed('camera') }
                        label='设备摄像头' />
                    <X.RadioField
                        size='big'
                        color='white'
                        isDisabled={ !stepChecks.includes('camera') }
                        isChecked={ stepChecks.includes('radar') }
                        hasAppend={ true }
                        onPress={ () => this.handleSensorRadioPressed('radar') }
                        label='原车雷达' />
                </View>
            </View>
        )
    }

    renderSensorsStepPointCamera() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Button
                    size='small' color='ghost' textWeight='light'
                    style={ Styles.onboardingStepPointCrumb }
                    onPress={ () => this.handleSensorRadioPressed('index') }>
                    openpilot 的传感器
                </X.Button>
                <X.Text size='medium' color='white' weight='bold'>
                    设备摄像头
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    我们利用后置摄像头图像规划出行车路径。
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    系统会根据识别准确度，绘制不同粗细的车道线。
                </X.Text>
                <X.Button color='ghost'
                    style={ Styles.onboardingStepPointInstruction }
                    onPress={ () => this.animateTouchGateHighlighted(100) }>
                    <X.Text
                        size='small' color='white' weight='semibold'
                        style={ Styles.onboardingStepPointInstructionText }>
                        请点击画面中的行车路径继续
                    </X.Text>
                    <X.Image
                      source={ require('../../../img/icon_chevron_right.png') }
                      style={ Styles.onboardingStepPointInstructionIcon } />
                </X.Button>
            </X.Entrance>
        )
    }

    renderSensorsStepPointRadar() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Button
                    size='small' color='ghost' textWeight='light'
                    style={ Styles.onboardingStepPointCrumb }
                    onPress={ () => this.handleSensorRadioPressed('index') }>
                    openpilot 的传感器
                </X.Button>
                <X.Text size='medium' color='white' weight='bold'>
                    原车雷达
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    Openpilot 需要原车使用雷达信号数据计算出与前车的距离，以供纵向控制使用。
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    三角形指示标志的颜色（红色或黄色）用来表示与前车之间的相对速度。
                </X.Text>
                <X.Button color='ghost'
                    style={ Styles.onboardingStepPointInstruction }
                    onPress={ () => this.handleWrongGatePressed() }>
                    <X.Text
                        size='small' color='white' weight='semibold'
                        style={ Styles.onboardingStepPointInstructionText }>
                        请点击画面中的前车指标继续
                    </X.Text>
                    <X.Image
                        source={ require('../../../img/icon_chevron_right.png') }
                        style={ Styles.onboardingStepPointInstructionIcon } />
                </X.Button>
            </X.Entrance>
        )
    }

    renderSensorsStep() {
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                { this.renderSensorsStepPoint() }
            </X.Entrance>
        )
    }

    renderEngagingStepPointIndex() {
        const { stepChecks } = this.state;
        return (
            <View style={ Styles.onboardingStepPoint }>
                <View style={ Styles.onboardingStepPointChain }>
                    <X.Button
                        size='small' color='ghost'
                        style={ Styles.onboardingStepPointChainPrevious }
                        onPress={ () => this.setStep('OB_SENSORS') }>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointChainPreviousIcon } />
                    </X.Button>
                    <View style={ Styles.onboardingStepPointChainNumber }>
                        <X.Text color='white' weight='semibold'>
                            3
                        </X.Text>
                    </View>
                </View>
                <View style={ Styles.onboardingStepPointBody }>
                    <X.Text size='bigger' color='white' weight='bold'>
                        openpilot 将在巡航系统启用后开始运行。
                    </X.Text>
                    <X.Text
                        size='smallish' color='white' weight='light'
                        style={ Styles.onboardingStepContext }>
                        按下巡航按钮启动，踩下油门或刹车取消。
                    </X.Text>
                    <X.RadioField
                        size='big'
                        color='white'
                        isChecked={ stepChecks.includes('cruise') }
                        hasAppend={ true }
                        onPress={ () => this.handleEngageRadioPressed('cruise') }
                        label='启用 openpilot' />
                    <X.RadioField
                        size='big'
                        color='white'
                        isDisabled={ !stepChecks.includes('cruise') }
                        isChecked={ stepChecks.includes('monitoring') }
                        hasAppend={ true }
                        onPress={ () => this.handleEngageRadioPressed('monitoring') }
                        label='驾驶监控' />
                </View>
            </View>
        )
    }

    renderEngagingStepPointEngage() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Button
                    size='small' color='ghost' textWeight='light'
                    style={ Styles.onboardingStepPointCrumb }
                    onPress={ () => this.handleEngageRadioPressed('index') }>
                    openpilot 控制
                </X.Button>
                <X.Text size='medium' color='white' weight='bold'>
                    启用 openpilot
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    当车辆行驶在安全速度时，您可以按下位于方向盘上的定速按钮 “SET” 启用 openpilot。
                </X.Text>
                <X.Button color='ghost'
                    style={ Styles.onboardingStepPointInstruction }
                    onPress={ () => this.handleWrongGatePressed() }>
                    <X.Text
                        size='small' color='white' weight='semibold'
                        style={ Styles.onboardingStepPointInstructionText }>
                        请点击画面中的 “SET” 继续
                    </X.Text>
                    <X.Image
                        source={ require('../../../img/icon_chevron_right.png') }
                        style={ Styles.onboardingStepPointInstructionIcon } />
                </X.Button>
            </X.Entrance>
        )
    }

    renderEngagingStepPointMonitoring() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleEngageRadioPressed('index') }>
                        openpilot 控制
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        驾驶监控
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        使用 openpilot 时，请务必随时注意前方路况! openpilot 通过 3D 人脸/姿态识别来判断驾驶员的状态，若是检测到驾驶员注意力不集中，openpilot 会先提醒驾驶员然后退出控制，除非驾驶员改正问题，集中注意力。
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            请点击画面中的人脸继续
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderLaneChangeStepPointIndex() {
        const { stepChecks } = this.state;
        return (
            <View style={ Styles.onboardingStepPoint }>
                <View style={ Styles.onboardingStepPointChain }>
                    <X.Button
                        size='small' color='ghost'
                        style={ Styles.onboardingStepPointChainPrevious }
                        onPress={ () => this.setStep('OB_ENGAGE') }>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointChainPreviousIcon } />
                    </X.Button>
                    <View style={ Styles.onboardingStepPointChainNumber }>
                        <X.Text color='white' weight='semibold'>
                            4
                        </X.Text>
                    </View>
                </View>
                <View style={ Styles.onboardingStepPointBody }>
                    <X.Text size='bigger' color='white' weight='bold'>
                        openpilot 可以在你的协助下切换车道。
                    </X.Text>
                    <X.Text
                        size='smallish' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmall }>
                          openpilot 无法确认周边车道是否安全，需要你自己观察确认，无论旁边车道是否有车，openpilot 都会切换成车道。
                    </X.Text>
                    <X.RadioField
                        size='big'
                        color='white'
                        isChecked={ stepChecks.includes('start') }
                        hasAppend={ true }
                        onPress={ () => this.handleLaneChangeRadioPressed('start') }
                        label='开始切换车道' />
                    <X.RadioField
                        size='big'
                        color='white'
                        isDisabled={ !stepChecks.includes('start') }
                        isChecked={ stepChecks.includes('perform') }
                        hasAppend={ true }
                        onPress={ () => this.handleLaneChangeRadioPressed('perform') }
                        label='执行车道切换' />
                </View>
            </View>
        )
    }

    renderLaneChangeStepPointStart() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleLaneChangeRadioPressed('index') }>
                        openpilot 控制
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        执行车道切换
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        启用 openpilot 以后，打开转向灯，检查周边车道情况，确认可以安全的切换车道。
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            点击转向灯
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderLaneChangeStepPointPerform() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleLaneChangeRadioPressed('index') }>
                        openpilot 切换车道
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        开始切换车道
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        注意周边车道安全的情况下，同时打开转向灯，并转动方向盘开始切换车道。
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            点击方向盘
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderDisengagingStepPointIndex() {
        const { stepChecks } = this.state;
        return (
            <View style={ Styles.onboardingStepPoint }>
                <View style={ Styles.onboardingStepPointChain }>
                    <X.Button
                        size='small' color='ghost'
                        style={ Styles.onboardingStepPointChainPrevious }
                        onPress={ () => this.setStep('OB_LANECHANGE') }>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointChainPreviousIcon } />
                    </X.Button>
                    <View style={ Styles.onboardingStepPointChainNumber }>
                        <X.Text color='white' weight='semibold'>
                            5
                        </X.Text>
                    </View>
                </View>
                <View style={ Styles.onboardingStepPointBody }>
                    <X.Text size='bigger' color='white' weight='bold'>
                        踩下刹车踏板退出 openpilot
                    </X.Text>
                    <X.Text
                        size='smallish' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmall }>
                        当遇到危险情况或者要驶出高速公路的时候，可以踩下刹车或油门退出 openpilot
                    </X.Text>
                    <X.RadioField
                        size='big'
                        color='white'
                        isChecked={ stepChecks.includes('limitations') }
                        hasAppend={ true }
                        onPress={ () => this.handleDisengageRadioPressed('limitations') }
                        label='功能限制' />
                    <X.RadioField
                        size='big'
                        color='white'
                        isDisabled={ !stepChecks.includes('limitations') }
                        isChecked={ stepChecks.includes('disengage') }
                        hasAppend={ true }
                        onPress={ () => this.handleDisengageRadioPressed('disengage') }
                        label='执行车道切换' />
                </View>
            </View>
        )
    }

    renderDisengagingStepPointLimitations() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleDisengageRadioPressed('index') }>
                        退出 openpilot
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        功能限制
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        请注意，在红绿灯号标志、停车信号灯标志、前方车辆快速切入、无法识别的行人等特定路况下，openpilot 无法正确处理，有可能导致异常加速。
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            请点击画面中的红绿灯继续
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderDisengagingStepPointDisengage() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleDisengageRadioPressed('index') }>
                        openpilot 控制
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        退出 openpilot
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        使用 openpilot 时，您可以随时改为人工操作方向盘，openpilot 会继续控制车速，直到踩下油门或刹车取消 openpilot 为止。
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            请点击画面中的油门或刹车继续
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderEngagingStep() {
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                { this.renderEngagingStepPoint() }
            </X.Entrance>
        )
    }

    renderLaneChangeStep() {
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                { this.renderLaneChangeStepPoint() }
            </X.Entrance>
        )
    }

    renderDisengagingStep() {
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                { this.renderDisengagingStepPoint() }
            </X.Entrance>
        )
    }

    renderOutroStep() {
        return (
            <X.Entrance style={ Styles.onboardingOutroView }>
                <X.Text
                    size='jumbo' color='white' weight='bold'
                    style={ Styles.onboardingStepHeader }>
                    恭喜! 您已经学完了教程。
                </X.Text>
                <X.Text
                    color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    您可以随时到设置里重新阅读使用教程，了解更多关于 openpilot 的信息，请查看 wiki 或加入 discord.comma.ai 社区交流。
                </X.Text>
                <X.Line color='transparent' spacing='small' />
                <View style={ Styles.onboardingActionsRow }>
                    <View style={ Styles.onboardingPrimaryAction }>
                        <X.Button
                            color='setupPrimary'
                            onPress={ this.props.completeTrainingStep }>
                            完成
                        </X.Button>
                    </View>
                    <View style={ Styles.onboardingSecondaryAction }>
                        <X.Button
                            color='setupInverted'
                            textColor='white'
                            onPress={ this.handleRestartPressed }>
                            重新学习
                        </X.Button>
                    </View>
                </View>
            </X.Entrance>
        )
    }

    renderSensorsStepPoint() {
        const { stepPoint } = this.state;
        switch (stepPoint) {
            case 0:
                return this.renderSensorsStepPointIndex(); break;
            case 1:
                return this.renderSensorsStepPointCamera(); break;
            case 2:
                return this.renderSensorsStepPointRadar(); break;
        }
    }

    renderEngagingStepPoint() {
        const { stepPoint } = this.state;
        switch (stepPoint) {
            case 0:
                return this.renderEngagingStepPointIndex(); break;
            case 1:
                return this.renderEngagingStepPointEngage(); break;
            case 2:
                return this.renderEngagingStepPointMonitoring(); break;
        }
    }

    renderLaneChangeStepPoint() {
        const { stepPoint } = this.state;
        switch (stepPoint) {
            case 0:
                return this.renderLaneChangeStepPointIndex(); break;
            case 1:
                return this.renderLaneChangeStepPointStart(); break;
            case 2:
                return this.renderLaneChangeStepPointPerform(); break;
        }
    }

    renderDisengagingStepPoint() {
        const { stepPoint } = this.state;
        switch (stepPoint) {
            case 0:
                return this.renderDisengagingStepPointIndex(); break;
            case 1:
                return this.renderDisengagingStepPointLimitations(); break;
            case 2:
                return this.renderDisengagingStepPointDisengage(); break;
        }
    }

    renderStep() {
        const { step } = this.state;
        switch (step) {
            case Step.OB_SPLASH:
                return this.renderSplashStep(); break;
            case Step.OB_INTRO:
                return this.renderIntroStep(); break;
            case Step.OB_SENSORS:
                return this.renderSensorsStep(); break;
            case Step.OB_ENGAGE:
                return this.renderEngagingStep(); break;
            case Step.OB_LANECHANGE:
                return this.renderLaneChangeStep(); break;
            case Step.OB_DISENGAGE:
                return this.renderDisengagingStep(); break;
            case Step.OB_OUTRO:
                return this.renderOutroStep(); break;
        }
    }

    render() {
        const {
            step,
            stepPoint,
            stepChecks,
            photoOffset,
            photoCycled,
            photoCycledLast,
            leadEntered,
            engagedMocked,
            gateHighlighted,
        } = this.state;

        const overlayStyle = [
            Styles.onboardingOverlay,
            stepPoint > 0 ? Styles.onboardingOverlayCollapsed : null,
        ];

        const gradientColor = engagedMocked ? 'engaged_green' : 'dark_blue';

        const Animations = {
            leadIndicatorDescended: {
                transform: [{
                    translateY: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 40]
                    })
                }, {
                    translateX: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, -10]
                    })
                }, {
                    scaleX: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 1.5]
                    })
                }, {
                    scaleY: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 1.5]
                    })
                }]
            },
        };

        return (
            <View style={ Styles.onboardingContainer }>
                <Animated.Image
                    source={ require('../../../img/photo_baybridge_a_01.jpg') }
                    style={ [Styles.onboardingPhoto, {
                        transform: [{
                            translateX: photoOffset.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, -50]
                            })
                        }],
                    }] }>
                </Animated.Image>
                <Animated.Image
                    source={ require('../../../img/illustration_training_lane_01.png') }
                    style={ [Styles.onboardingVisualLane, {
                        transform: [{
                            translateX: photoOffset.interpolate({
                                inputRange: [0, 100],
                                outputRange: [50, 0]
                            })
                        }],
                        opacity: photoOffset.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0, 1],
                        })
                    }] } />

                <View style={[{ flexDirection: 'row',
        justifyContent: 'center', position: 'absolute' }, Styles.onboardingVisualLane]}>
                    <Animated.Image
                        source={ require('../../../img/illustration_training_lane_01.png') }
                        tintColor='lime'
                        pointerEvents='none'
                        style={ [Styles.absoluteFill, {
                            opacity: gateHighlighted.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, 1],
                            })
                        }] } />
                    { stepPoint == 1 ? (
                        <View style={ Styles.onboardingVisualLaneTouchGate }>
                            <X.Button
                                onPress={ () => { this.handleSensorVisualPressed('camera') } }
                                style={ Styles.onboardingVisualLaneTouchGateButton } />
                        </View>
                    ) : null }
                </View>

                { (step === 'OB_SENSORS' && stepPoint > 1) ? (
                    <View style={ Styles.onboardingVisuals }>
                        <Animated.Image
                            source={ require('../../../img/photo_baybridge_b_01.jpg') }
                            style={ [Styles.onboardingPhotoCycled, {
                                opacity: photoCycled.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 1],
                                })
                            }] } />
                        <Animated.Image
                            source={ require('../../../img/illustration_training_lane_02.png') }
                            style={ [Styles.onboardingVisualLaneZoomed, {
                                opacity: photoCycled.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 1],
                                })
                            }] }>
                        </Animated.Image>
                        <Animated.Image
                            source={ require('../../../img/illustration_training_lead_01.png') }
                            style={ [Styles.onboardingVisualLead,
                                Animations.leadIndicatorDescended ] } />
                        <Animated.Image
                            source={ require('../../../img/illustration_training_lead_02.png') }
                            style={ [Styles.onboardingVisualLead,
                                Styles.onboardingVisualLeadZoomed,
                                Animations.leadIndicatorDescended, {
                                opacity: photoCycled.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 1]
                                }),
                            }] } />
                        <Animated.View
                            style={ [Styles.onboardingVisualLeadTouchGate,
                                Animations.leadIndicatorDescended, {
                                  opacity: gateHighlighted.interpolate({
                                      inputRange: [0, 100],
                                      outputRange: [0, 1],
                                  }),
                                }] }>
                            <X.Button
                                style={ Styles.onboardingVisualLeadTouchGateButton }
                                onPress={ () => { this.handleSensorVisualPressed('radar') } } />
                        </Animated.View>
                    </View>
                ) : null }

                { step === 'OB_ENGAGE' ? (
                    <View style={ Styles.onboardingVisuals }>
                        <Animated.Image
                            source={ require('../../../img/photo_wheel_buttons_01.jpg') }
                            style={ [Styles.onboardingPhotoCruise] } />
                        { stepPoint == 1 ? (
                            <Animated.View
                              style={ [Styles.onboardingVisualCruiseTouchContainer, {
                                opacity: gateHighlighted.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 1],
                                }),
                              }] }>
                                <X.Button
                                    style={ Styles.onboardingVisualCruiseTouchGateButton }
                                    onPress={ () => { this.handleEngageVisualPressed('cruise') } } />
                            </Animated.View>
                        ) : null }
                        { stepPoint == 2 ? (
                            <React.Fragment>
                                <Animated.Image
                                    source={ require('../../../img/photo_monitoring_01.jpg') }
                                    style={ [Styles.onboardingPhotoCycled, Styles.onboardingFaceImage, {
                                        opacity: photoCycled.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [0, 1],
                                        }),
                                    }] }>
                                </Animated.Image>
                                <Animated.View style={ [Styles.onboardingFaceTouchGate, {
                                  opacity: gateHighlighted.interpolate({
                                      inputRange: [0, 100],
                                      outputRange: [0, 1],
                                  }),
                                }]}>
                                    <X.Button
                                        style={ Styles.onboardingTouchGateButton }
                                        onPress={ () => { this.handleEngageVisualPressed('monitoring') } } />
                                </Animated.View>
                            </React.Fragment>
                        ) : null }
                    </View>
                ) : null }

                { step === 'OB_LANECHANGE' ? (
                    <View style={ Styles.onboardingVisuals }>
                        <Animated.Image
                            source={ require('../../../img/photo_turn_signal_02.jpg') }
                            style={ [Styles.onboardingPhotoSignal] } />
                        { stepPoint == 1 ? (
                            <Animated.View style={ [Styles.onboardingSignalTouchGate, {
                              opacity: gateHighlighted.interpolate({
                                  inputRange: [0, 100],
                                  outputRange: [0, 1],
                              }),
                            }]}>
                                <X.Button
                                    style={ Styles.onboardingTouchGateButton }
                                    onPress={ () => { this.handleLaneChangeVisualPressed('start') } } />
                            </Animated.View>
                        ) : null }
                        { stepPoint == 2 ? (
                            <React.Fragment>
                                <Animated.Image
                                    source={ require('../../../img/photo_wheel_hands_01.jpg') }
                                    style={ [Styles.onboardingPhotoCycled, {
                                        opacity: photoCycled.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [0, 1],
                                        }),
                                    }] }>
                                </Animated.Image>
                                <Animated.View style={ [Styles.onboardingWheelTouchGate, {
                                  opacity: gateHighlighted.interpolate({
                                      inputRange: [0, 100],
                                      outputRange: [0, 1],
                                  }),
                                }]}>
                                    <X.Button
                                        style={ Styles.onboardingTouchGateButton }
                                        onPress={ () => { this.handleLaneChangeVisualPressed('perform') } } />
                                </Animated.View>
                            </React.Fragment>
                        ) : null }
                    </View>
                ) : null }

                { step === 'OB_DISENGAGE' ? (
                    <View style={ Styles.onboardingVisuals }>
                        <Animated.Image
                            source={ require('../../../img/photo_traffic_light_01.jpg') }
                            style={ [Styles.onboardingPhotoCruise] } />
                        { stepPoint == 1 ? (
                            <Animated.View style={ [Styles.onboardingLightTouchGate, {
                                opacity: gateHighlighted.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 1],
                                }),
                            }]}>
                                <X.Button
                                    style={ Styles.onboardingTouchGateButton }
                                    onPress={ () => { this.handleDisengageVisualPressed('limitations') } } />
                            </Animated.View>
                        ) : null }
                        { stepPoint == 2 ? (
                            <View style={ Styles.onboardingVisuals }>
                                <Animated.Image
                                    source={ require('../../../img/photo_pedals_01.jpg') }
                                    style={ [Styles.onboardingPhotoCycled, Styles.onboardingPhotoPedals, {
                                        opacity: photoCycledLast.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [0, 1],
                                        }),
                                    }] } />
                                <Animated.View style={ [Styles.onboardingBrakePedalTouchGate, {
                                  opacity: gateHighlighted.interpolate({
                                      inputRange: [0, 100],
                                      outputRange: [0, 1],
                                  }),
                                }]}>
                                    <X.Button
                                        style={ Styles.onboardingTouchGateButton }
                                        onPress={ () => { this.handleDisengageVisualPressed('disengage') } } />
                                </Animated.View>
                                <Animated.View style={ [Styles.onboardingGasPedalTouchGate, {
                                  opacity: gateHighlighted.interpolate({
                                      inputRange: [0, 100],
                                      outputRange: [0, 1],
                                  }),
                                }] }>
                                    <X.Button
                                        style={ Styles.onboardingTouchGateButton }
                                        onPress={ () => { this.handleDisengageVisualPressed('disengage') } } />
                                </Animated.View>
                            </View>
                        ) : null }
                    </View>
                ) : null }

                <Animated.View
                    style={ overlayStyle }>
                    <X.Gradient
                        color={ gradientColor }>
                        { this.renderStep() }
                    </X.Gradient>
                </Animated.View>
            </View>
        )
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    completeTrainingStep: completeTrainingStep('Onboarding', dispatch),
    restartTraining: () => {
        onTrainingRouteCompleted('Onboarding');
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
