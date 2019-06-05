import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { StorageService, NotificationService } from '../../common';
import { CSECURITY } from '../../app.constants';
import { environment } from '../../../environments/environment';
import { AppBase } from '../../app.base';

@Component({
    selector: 'img-upload',
    templateUrl: './img-upload.component.html',
    styles: [
        `img{
            object-fit: cover;
        };
        .image-upload {
            height: 70px;
            display:-webkit-box;
            display:-ms-flexbox;
            display:flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
        }`
    ]
})

export class ImageUploadComponent extends AppBase {

    @Input() item: any;
    @Input() folderImage: string = '';  //module
    @Input() src: string = '';
    @Input() path: string = '';
    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    bearer: string = '';
    module: string = '';
    mediaurl: string = '';

    constructor(private ele: ElementRef,
        private _localstorage: StorageService,
        private _notification: NotificationService) { super(); }

    ngOnInit() {

        this.bearer = this._localstorage.getItem(CSECURITY.tokenName, false);
        this.mediaurl = environment.HOST_IMG;
        this.module = this.folderImage;
        this.onImageUploadInit();
    }

    ngOnChange() {
        this.onImageUploadInit();
    }

    //init lib
    onImageUploadInit() {
        $(this.ele.nativeElement).find('img').froalaEditor({
            language: 'vi',
            imageEditButtons: ['imageReplace', 'imageRemove'],
            imageMaxSize: 2 * 1024 * 1024,
            imageAllowedTypes: ['jpeg', 'jpg', 'png'],
            requestHeaders: {
                Authorization: 'Bearer ' + this.bearer,
                Module: this.module,
                path: this.path
            },
            imageUploadURL: this.mediaurl + '/Media/Upload/Image',
            fileUploadURL: this.mediaurl + '/Media/Upload/File',
            imageManagerLoadURL: this.mediaurl + '/Media/Images'
        });
    }

    // fn upload
    onUpload() {
        $(this.ele.nativeElement).find('img').froalaEditor({
            imageEditButtons: ['imageReplace'],
        }).on('froalaEditor.contentChanged', (e) => {
            this.src = e.target.src;
            this.select.emit(this.src);

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
                this._notification.pushToast('Lỗi ', 'File ảnh phải nhỏ hơn 2 MB', 'error');
            }
            // Invalid image type.
            else if (error.code == 6) {
                this._notification.pushToast('Lỗi ', 'File ảnh phải có định dạng là JPEG/PNG/JPG', 'error');
            }
        });
    }

}