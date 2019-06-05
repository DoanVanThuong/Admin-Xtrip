import { Component, Output, EventEmitter, ElementRef } from '@angular/core';
import { TourImage } from '../../../../../common/entities/tours/tour-image';
import { Image, StorageService, TourRepo, NotificationService, TourGeneral, Error, Spinner } from '../../../../../common';
import { CSECURITY, ACTION_TOUR, CSTORAGE } from '../../../../../app.constants';
import { environment } from '../../../../../../environments/environment';
import { AppBase } from '../../../../../app.base';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

@Component({
    selector: 'tour-uploadImage',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.less']
})

export class TourUploadImageComponent extends AppBase {
    @Output() changeTab = new EventEmitter();

    action: string = ACTION_TOUR.CREATE;
    photos: any[] = [];
    images: TourImage = new TourImage();

    fileUploaded: string = '';
    selectedImage: Image = null;
    isOverSize: boolean = false;

    src: string = '';
    name: string = '';
    imgDefault: string = 'assets/images/img-inputfile.png';

    tourGeneral: any = {};

    mediaurl: string = '';
    bearer: string = '';
    arrivalCode: string = '';
    supplierCode: string = '';
    module: string = '';
    tourId: string = '';

    isUpload: boolean = false;

    selectedIndex: number = 0;

    constructor(private _tourRepo: TourRepo,
        private _localstorage: StorageService,
        private _notification: NotificationService,
        private _activeRoute: ActivatedRoute,
        private ele: ElementRef,
        private _spinner: Spinner) {
        super();

    }

    ngOnInit() {
        this.mediaurl = environment.HOST_IMG;
        this.bearer = 'Bearer ' + this._localstorage.getItem(CSECURITY.tokenName, false);
        this.module = 'Tour';
        this._activeRoute.queryParams.subscribe((params) => {
            if (!!params && params.id && params.action) {
                this.action = params.action;
                this.tourId = params.id;
                this.getListImage(this.tourId);
            }
        });
        switch (this.action) {
            case ACTION_TOUR.UPDATE: {
                this.getTourInfo(this.tourId);
                break;
            }
            case ACTION_TOUR.CLONE: {
                this.tourGeneral = this._localstorage.getItem(CSTORAGE.CLONETOUR);
                this.initImageLibary(this.tourGeneral);
                break;
            }
            default:
                this.tourGeneral = this._localstorage.getItem(CSTORAGE.TOUR_GENERAL);
                this.getListImage(this.tourGeneral.id);
                this.initImageLibary(this.tourGeneral);
                break;
        }
    }

    //fn init libary upload image
    initImageLibary(tour: TourGeneral) {
        //init lib ảnh
        $(this.ele.nativeElement)
            .find('#imgedit')
            .froalaEditor({
                language: 'vi',
                imageEditButtons: ['imageReplace'],
                imageMaxSize: 5 * 1024 * 1024,
                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                requestHeaders: {
                    Authorization: this.bearer,
                    Module: this.module,
                    Path: `/${tour.supplier.code}/${tour.arrivalCode}`
                },
                imageUploadURL: this.mediaurl + '/Media/Upload/Image',
                imageManagerLoadURL: this.mediaurl + '/Media/Images',

            });
    }

    //fn get thong tin cua tour
    async getTourInfo(id: string) {
        this._spinner.show();
        try {
            const data: any = await this._tourRepo.getTour(id);
            this.tourGeneral = new TourGeneral(data.data);
            this.initImageLibary(this.tourGeneral);
        } catch (error) {
            const errs = new Error(error[0]);
            this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error');
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn set ảnh đaại diện
    async setDefaultImageTour(img: any) {
        this.selectedImage = img;
        await this.setDefaultImage(this.tourGeneral.id, this.selectedImage);
    }

    //fn xóa ảnh
    async deleteImage(img: any) {
        await this.deleteImageTour(this.tourGeneral.id, img);
        this.images.photos.splice(_.findIndex(this.images.photos, item => item.src == img.src), 1);

        //nếu xóa ảnh đại diện cập nhật lại ảnh đại diện mới
        if (this.selectedImage.src === img.src) {
            await this.setDefaultImageTour(this.images.photos[0]);
        }
    }

    //input file image
    inputFile() {
        $(this.ele.nativeElement).find('#imgedit').froalaEditor({
            requestHeaders: {
                Authorization: this.bearer,
                Module: module,
                Path: `/${this.supplierCode}/${this.arrivalCode}`
            },
        }).on('froalaEditor.contentChanged', async (e) => {
            const src = e.target.src;
            if (src.includes("img-inputfile.png")) {
                return;
            }

            if (src == this.src) {
                $("#imgedit").attr('src', this.imgDefault);
                return;
            }
            if (src !== this.src && !src.includes("img-inputfile.png")) {
                this.src = e.target.src;

                this.upload();
            }
            $(this.ele.nativeElement).find('#imgedit').attr('src', this.imgDefault);
            return;
            //handle error
        }).on('froalaEditor.image.error', (e, editor, error, response) => {
            if (error.code == 1) {
                this._notification.pushToast('Lỗi ', error.message, 'error');
            }
            // No link in upload response.
            else if (error.code == 2) {
                this._notification.pushToast('Lỗi ', error.message, 'error');
            }
            // Error during image upload.
            else if (error.code == 3) {
                this._notification.pushToast('Lỗi ', error.message, 'error');
            }
            // Parsing response failed.
            else if (error.code == 4) {
                this._notification.pushToast('Lỗi ', error.message, 'error');
            }
            // Image too text-large.
            if (error.code == 5) {
                this._notification.pushToast('Lỗi ', 'File ảnh phải nhỏ hơn 5 MB', 'error');
            }
            // Invalid image type.
            else if (error.code == 6) {
                this._notification.pushToast('Lỗi ', 'File ảnh phải có định dạng là JPEG/PNG/JPG', 'error');
            }

        });
    }

    //fn upload và get list image
    async upload() {
        if (this.action === ACTION_TOUR.CLONE) {
            this.images.photos.push(new Image({ src: this.src, name: '' }));
            if (this.isUpload) {
                this.upLoadImageTour(this.tourGeneral.id, this.src);
                await this.getListImage(this.tourGeneral.id);
            }
            else {
                for (const photo of this.images.photos) {
                    this.upLoadImageTour(this.tourGeneral.id, photo.src);
                    this.isUpload = true;
                }
                await this.getListImage(this.tourGeneral.id);
            }
        } else {
            await this.upLoadImageTour(this.tourGeneral.id, this.src);
            await this.getListImage(this.tourGeneral.id);
            this.src = '';
        }
    }

    //fn upload lên serve ảnh 
    async upLoadImageTour(id: string, src: string) {
        this._spinner.show();

        const body = {
            name: this.tourGeneral.name,
            src: src
        }
        try {
            await this._tourRepo.uploadImage(body, id);

            // upload thành công cập nhật lại ảnh đại diện khi chưa có ảnh đại diện
            if (_.isNull(this.selectedImage)) {
                await this.setDefaultImageTour(body);
            }
        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //lấy ds ảnh thuộc tour id
    async getListImage(id: string) {
        this._spinner.show();
        try {
            const dataFromServer: any = await this._tourRepo.getListImage(id);
            this.images = dataFromServer.data;
            
            this.selectedImage = dataFromServer.data.photo;

            // xóa ảnh trùng
            // this.images.photos = _.uniqBy(this.images.photos, i => i.src);

        } catch (error) {
            const errs = new Error(error[0]);
            this._notification.pushToast(`${errs.value || 'Có lỗi xảy ra'}`, 'vui lòng kiểm tra lại', 'error', 2000);
         }
        finally {
            this._spinner.hide();
        }
    }

    //fn delete image tour
    async deleteImageTour(id: string, image: any) {
        this._spinner.show();
        try {
            const body = {
                name: image.name,
                src: image.src
            }
            await this._tourRepo.deleteImage(id, body);
        } catch (error) { }
        finally {
            this._spinner.hide();
        }
    }

    //đặt ảnh đại diện
    async setDefaultImage(id: string, image) {
        this._spinner.show();
        try {
            const body = {
                name: image.name,
                src: image.src
            }
            await this._tourRepo.setDefaulImageTour(id, body);
        } catch (error) { } finally {
            this._spinner.hide();
        }
    }

    //chuyển tab
    async btnCompleteUploadImage() {
        switch (this.action) {
            case ACTION_TOUR.UPDATE: {
                this._notification.pushAlert('Thành công', 'Ảnh về tour đã được cập nhật', 'success');
                break;
            }
            case ACTION_TOUR.CLONE: {
                if (!this.isUpload) {
                    for (const photo of this.images.photos || []) {
                        this.upLoadImageTour(this.tourGeneral.id, photo.src);
                    }
                    this.setDefaultImage(this.tourGeneral.id, this.selectedImage)
                    this.changeTab.emit('journey');
                }
            }
            default:
                this.changeTab.emit('journey');
                break;
        }
    }

    dragTour(e: any, currenIndex: number) {
        this.selectedIndex = currenIndex;
    }

    //fn on drop tour
    dropTour(e: any) {
        if (this.selectedIndex !== e.dropIndex) {
            this.updateWeightImage(this.tourGeneral.id, e.value.weight || 0, e.dropIndex, new Image(e.value));
        }
    }

    //fn update weight image
    async updateWeightImage(id: string, currenIndex: number = 0, dropIndex: number = 0, image: Image) {
        this._spinner.show();
        const body = {
            name: image.getName(),
            src: image.getSrc(),
            weight: dropIndex,
            lastWeight: currenIndex
        }
        try {
            await this._tourRepo.updateWeightImage(id, body);
            this.getListImage(this.tourGeneral.id);
        } catch (error) {    }
        finally{
            this._spinner.hide();
        }

    }
}