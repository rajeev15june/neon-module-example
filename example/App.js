import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback, FlatList, Image, ScrollView
} from 'react-native';
import NeonAndroid from 'react-native-neon-android';
import * as Constants from './Constants';

let imageTagList = [
    {
        mandatory: false,
        numberOfPhotos: 1,
        tagId: "1",
        tagName: "Tag1",
        location: null,
    },

    {
        mandatory: false,
        numberOfPhotos: 1,
        tagId: "2",
        tagName: "Tag2",
        location: null,
    }

];

let neonParams = {
    libraryMode: 0,
    numberOfPhotos: 0,
    cameraFacing: 0,
    cameraOrientation: 0,
    cameraViewType: 0,
    galleryViewType: 0,
    tagEnabled: false,
    flashEnabled: true,
    cameraSwitchingEnabled: false,
    cameraToGallerySwitchEnabled: false,
    enableFolderStructure: true,
    galleryToCameraSwitchEnabled: false,
    isRestrictedExtensionJpgPngEnabled: true,
    enableImageEditing: false,
    locationRestrictive: false,
    hideCameraButtonInNeutral: false,
    hideGalleryButtonInNeutral: false,
    hasOnlyProfileTag: false,
    profileTagName: null,
    imageTagListJson: null,
    alreadyAddedImagesJson: null,
};


export default class App extends Component<Props> {
    constructor() {
        super();
        this.openNeon = this.openNeon.bind(this);
        this.prepareList = this.prepareList.bind(this);
        this.state = {
            images: [],
            alreadyAddedImages: []
        }

    }

    onLivePhotoClicked = (response) => {
        console.log('Live Photo ==>', response);
    };

    componentDidMount(){
        NeonAndroid.addEventListener('livePhoto', this.onLivePhotoClicked);
    }

    componentWillUnmount(){
        NeonAndroid.removeEventListener('livePhoto', this.onLivePhotoClicked)
    }

    openNeon(position) {
        let params = {};
        switch (position) {
            case Constants.OPEN_NEUTRAL:
                params.profileTagName = 'Cover';
                params.hasOnlyProfileTag = true;
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openNeutral(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_CAMERA:
                params.cameraOrientation = 1;
                params.flashEnabled = true;
                params.cameraSwitchingEnabled = true;
                params.cameraToGallerySwitchEnabled = false;
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openCamera(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_CAMERA_PRIORITY:
                params.cameraOrientation = 1;
                params.flashEnabled = true;
                params.cameraSwitchingEnabled = true;
                params.tagEnabled = true;
                params.libraryMode = 1;
                params.numberOfPhotos = 2;
                params.cameraToGallerySwitchEnabled = true;
                params.imageTagListJson = JSON.stringify(imageTagList);
                NeonAndroid.openCamera(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_GALLERY_FOLDERS:
                params.galleryToCameraSwitchEnabled = false;
                params.numberOfPhotos = 0;
                params.enableFolderStructure = true;
                params.imageTagListJson = JSON.stringify(imageTagList);
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openGallery(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_GALLERY_FOLDERS_PRIORITY:
                params.galleryToCameraSwitchEnabled = true;
                params.numberOfPhotos = 0;
                params.enableFolderStructure = true;
                params.imageTagListJson = JSON.stringify(imageTagList);
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openGallery(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_GALLERY_FILES:
                params.galleryToCameraSwitchEnabled = false;
                params.numberOfPhotos = 2;
                params.enableFolderStructure = false;
                params.libraryMode = 1;
                params.galleryViewType = 0;
                params.tagEnabled = true;
                params.imageTagListJson = JSON.stringify(imageTagList);
                NeonAndroid.openGallery(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_GALLERY_FILES_PRIORITY:
                params.galleryToCameraSwitchEnabled = true;
                params.numberOfPhotos = 0;
                params.galleryViewType = 0;
                params.enableFolderStructure = false;
                params.imageTagListJson = JSON.stringify(imageTagList);
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openGallery(JSON.stringify(params), (response) => this.prepareList(response));
                break;

            case Constants.OPEN_GALLERY_HORIZONTAL:
                params.galleryToCameraSwitchEnabled = false;
                params.numberOfPhotos = 0;
                params.galleryViewType = 1;
                params.enableFolderStructure = false;
                params.imageTagListJson = JSON.stringify(imageTagList);
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openGallery(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_GALLERY_HORIZONTAL_PRIORITY:
                params.galleryToCameraSwitchEnabled = true;
                params.numberOfPhotos = 0;
                params.galleryViewType = 1;
                params.enableFolderStructure = false;
                params.imageTagListJson = JSON.stringify(imageTagList);
                params.alreadyAddedImagesJson = JSON.stringify(this.state.alreadyAddedImages);
                NeonAndroid.openGallery(JSON.stringify(params), (response) => this.prepareList(response));
                break;
            case Constants.OPEN_LIVE_PHOTOS:
                params.locationRestrictive = true;
                params.tagEnabled = true;
                params.imageTagListJson = JSON.stringify(imageTagList);
                NeonAndroid.openLivePhotos(JSON.stringify(params), (response) => this.prepareList(response));
                //NeonAndroid.oneStepPhotos('ID', 'PAN',(response) => this.prepareList(response));
                break;
            case Constants.OPEN_ONE_STEP:
                NeonAndroid.openOneStep('ID', 'PAN', null, (response) => this.prepareList(response));
                break;

        }
    }

    prepareList(response) {
        if (JSON.parse(response).imageCollection.length === 0) {
            this.setState({alreadyAddedImages: []});
            return;
        }
        let data = JSON.parse(response).imageCollection;
        this.setState({
            alreadyAddedImages: data,
            images: data
        });
    }

    renderItem({item, index}) {
        let imageUrl = '';
        if (item.filePath.toString().contains("//")) {
            imageUrl = item.filePath;
        } else {
            imageUrl = "file://" + item.filePath;
        }
        return (
            <View>
                <Image
                    style={{
                        alignSelf: 'center',
                        margin: 5,
                        width: 110,
                        height: 100,
                    }}
                    source={{uri: imageUrl}}
                />
            </View>

        )
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_NEUTRAL)}>
                        <Text style={styles.instructions}>
                            Neutral
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_CAMERA)}>
                        <Text style={styles.instructions}>
                            Camera
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_CAMERA_PRIORITY)}>
                        <Text style={styles.instructions}>
                            Camera Priority
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_GALLERY_FOLDERS)}>
                        <Text style={styles.instructions}>
                            Gallery(Folders)
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_GALLERY_FOLDERS_PRIORITY)}>
                        <Text style={styles.instructions}>
                            Gallery Priority(Folders)
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_GALLERY_FILES)}>
                        <Text style={styles.instructions}>
                            Gallery(Files)
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_GALLERY_FILES_PRIORITY)}>
                        <Text style={styles.instructions}>
                            Gallery Priority(Files)
                        </Text>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_GALLERY_HORIZONTAL)}>
                        <Text style={styles.instructions}>
                            Gallery(Horizontal)
                        </Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_GALLERY_HORIZONTAL_PRIORITY)}>
                        <Text style={styles.instructions}>
                            Gallery Priority(Horizontal)
                        </Text>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_LIVE_PHOTOS)}>
                        <Text style={styles.instructions}>
                            Live Photos
                        </Text>
                    </TouchableNativeFeedback>

                    <TouchableNativeFeedback onPress={() => this.openNeon(Constants.OPEN_ONE_STEP)}>
                        <Text style={styles.instructions}>
                            One Step
                        </Text>
                    </TouchableNativeFeedback>

                    <FlatList
                        contentContainerStyle={styles.list}
                        data={this.state.images}
                        renderItem={this.renderItem}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'green',
        padding: 12,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});

let fileInfo = {
    dateTimeTaken: "1522229825513",
    fileCount: 0,
    filePath: "https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024",
    selected: false,
    source: "PHONE_GALLERY",
    type: "IMAGE",
    latitude: "",
    longitude: "",
    fileName: "",
    displayName: "",
    fileTag: {
        mandatory: false,
        numberOfPhotos: 1,
        tagId: "3",
        tagName: "Tag3",
        location: null,
    }
};
