"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Faq_1 = __importDefault(require("../model/Faq"));
const Help_1 = __importDefault(require("../model/Help"));
const redis_1 = __importDefault(require("../redis"));
class PostService {
    constructor() {
        this.redisClient = new redis_1.default();
    }
    getPosts(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.redisClient.get(`${type}-all`);
            if (list)
                return list;
            if (type && type.toLowerCase() === "faq") {
                const faqList = yield Faq_1.default.find({}, { title: 1, type: 1, description: 1, _id: 1 });
                if (faqList) {
                    // console.log("ALL FAQ Posts", faqList);
                    yield this.redisClient.set(`${type}-all`, JSON.stringify(faqList));
                    return Promise.resolve(faqList);
                }
                else {
                    return Promise.reject("No List Found Or Something went wrong");
                }
            }
            else {
                const helpList = yield Help_1.default.find({}, {
                    title: 1,
                    type: 1,
                    description: 1,
                    subtitle: 1,
                    image: 1,
                    altText: 1,
                    paragraph: 1,
                    _id: 1,
                });
                if (helpList) {
                    // console.log("ALL HELP Posts", helpList);
                    yield this.redisClient.set(`${type}-all`, JSON.stringify(helpList));
                    return Promise.resolve(helpList);
                }
                else {
                    return Promise.reject("No List Found Or Something went wrong");
                }
            }
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = id.split("-")[0];
            const postId = id.split("-")[1];
            if (!(type && postId))
                return Promise.reject("Invalid Id");
            const cached = yield this.redisClient.get(id);
            if (cached)
                return cached;
            if (type && type.toLowerCase() === "faq") {
                const item = yield Faq_1.default.findOne({ _id: postId }, { title: 1, type: 1, description: 1, _id: 1 });
                if (item) {
                    console.log("FAQ Post", item);
                    yield this.redisClient.set(id, JSON.stringify(item));
                    return Promise.resolve(item);
                }
                else {
                    return Promise.reject("No Item Found");
                }
            }
            else {
                const item = yield Help_1.default.findOne({ _id: postId }, {
                    title: 1,
                    type: 1,
                    description: 1,
                    subtitle: 1,
                    image: 1,
                    altText: 1,
                    paragraph: 1,
                    _id: 1,
                });
                if (item) {
                    console.log("HELP Post", item);
                    yield this.redisClient.set(id, JSON.stringify(item));
                    return Promise.resolve(item);
                }
                else {
                    return Promise.reject("No Item Found");
                }
            }
        });
    }
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.type === "faq") {
                const { type, title, description, email } = data;
                const faq = new Faq_1.default({
                    type,
                    title,
                    description,
                    email,
                    createdBy: { email, createdOn: new Date() },
                    modifiedBy: { email, modifiedOn: new Date() },
                });
                return new Promise((resolve, reject) => {
                    faq.save((err, faq) => {
                        if (err) {
                            console.log("Some error in saving faq post");
                            reject(err);
                        }
                        console.log("Successfully saved faq with id=", faq._id.toString());
                        const { _id, type, title, description } = faq;
                        this.redisClient.del(`${type}-all`);
                        resolve({
                            _id: _id === null || _id === void 0 ? void 0 : _id.toString(),
                            type,
                            title,
                            description,
                            email,
                        });
                    });
                });
            }
            else {
                const { type, title, description, email, subtitle, image, altText, paragraph, } = data;
                const help = new Help_1.default({
                    type,
                    title,
                    description,
                    email,
                    subtitle,
                    image,
                    altText,
                    paragraph,
                    createdBy: { email, createdOn: new Date() },
                    modifiedBy: { email, modifiedOn: new Date() },
                });
                return new Promise((resolve, reject) => {
                    help.save((err, help) => {
                        if (err) {
                            console.log("Some error in saving help post");
                            reject(err);
                        }
                        console.log("Successfully saved help with id=", help._id.toString());
                        const { _id, type, title, description, subtitle, image, altText, paragraph, } = help;
                        this.redisClient.del(`${type}-all`);
                        resolve({
                            _id: _id === null || _id === void 0 ? void 0 : _id.toString(),
                            type,
                            title,
                            description,
                            email,
                            subtitle,
                            image,
                            altText,
                            paragraph,
                        });
                    });
                });
            }
        });
    }
    updatePost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.type === "faq") {
                const { type, title, description, email } = data;
                const post = yield Faq_1.default.findOne({ _id: data._id });
                post.title = title;
                post.description = description;
                post.modifiedBy = { email, modifiedOn: new Date() };
                return new Promise((resolve, reject) => {
                    post.save((err, faq) => {
                        if (err) {
                            console.log("Some error in saving faq post");
                            reject(err);
                        }
                        console.log("Successfully updated faq with id=", faq._id.toString());
                        const { _id, type, title, description } = faq;
                        this.redisClient.del(`${type}-all`);
                        resolve({ _id, type, title, description, email });
                    });
                });
            }
            else {
                const { type, title, description, email, subtitle, image, altText, paragraph, } = data;
                const post = yield Help_1.default.findOne({ _id: data._id });
                post.title = title;
                post.description = description;
                post.modifiedBy = { email, modifiedOn: new Date() };
                post.subtitle = subtitle;
                post.image = image;
                post.altText = altText;
                post.paragraph = paragraph;
                return new Promise((resolve, reject) => {
                    post.save((err, help) => {
                        if (err) {
                            console.log("Some error in saving help post");
                            reject(err);
                        }
                        console.log("Successfully updated help with id=", help._id.toString());
                        const { _id, type, title, description, subtitle, image, altText, paragraph, } = help;
                        this.redisClient.del(`${type}-all`);
                        resolve({
                            _id,
                            type,
                            title,
                            description,
                            email,
                            subtitle,
                            image,
                            altText,
                            paragraph,
                        });
                    });
                });
            }
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = id.split("-")[0];
            const postId = id.split("-")[1];
            if (!(type && postId))
                return Promise.reject("Invalid Id");
            const cached = yield this.redisClient.get(`${type}-del`);
            if (cached)
                return cached;
            if (type && type.toLowerCase() === "faq") {
                const item = yield Faq_1.default.deleteOne({ _id: postId });
                if (item) {
                    console.log("FAQ Item deleted with id=", postId);
                    yield this.redisClient.del(`${type}-all`);
                    yield this.redisClient.set(`${type}-del`, JSON.stringify(item));
                    return Promise.resolve(item);
                }
                else {
                    return Promise.reject("No Item Found");
                }
            }
            else {
                const item = yield Help_1.default.deleteOne({ _id: postId });
                if (item) {
                    console.log("HELP Item deleted with id=", postId);
                    yield this.redisClient.del(`${type}-all`);
                    yield this.redisClient.set(`${type}-del`, JSON.stringify(item));
                    return Promise.resolve(item);
                }
                else {
                    return Promise.reject("No Item Found");
                }
            }
        });
    }
}
exports.default = new PostService();
//# sourceMappingURL=PostService.js.map