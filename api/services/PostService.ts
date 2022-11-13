import IFaq from "../model/IFaq";
import Faqs from "../model/Faq";
import IHelp from "../model/IHelp";
import Helps from "../model/Help";
import redisClient from "../redis";

class PostService {
  private redisClient: any = new redisClient();
  async getPosts(type: string) {
    const list = await this.redisClient.get(`${type}-all`);
    if (list) return list;
    if (type && type.toLowerCase() === "faq") {
      const faqList = await Faqs.find(
        {},
        { title: 1, type: 1, description: 1, _id: 1 },
      );
      if (faqList) {
        // console.log("ALL FAQ Posts", faqList);
        await this.redisClient.set(`${type}-all`, JSON.stringify(faqList));
        return Promise.resolve(faqList);
      } else {
        return Promise.reject("No List Found Or Something went wrong");
      }
    } else {
      const helpList = await Helps.find(
        {},
        {
          title: 1,
          type: 1,
          description: 1,
          subtitle: 1,
          image: 1,
          altText: 1,
          paragraph: 1,
          _id: 1,
        },
      );
      if (helpList) {
        // console.log("ALL HELP Posts", helpList);
        await this.redisClient.set(`${type}-all`, JSON.stringify(helpList));
        return Promise.resolve(helpList);
      } else {
        return Promise.reject("No List Found Or Something went wrong");
      }
    }
  }

  async getPostById(id: string) {
    const type = id.split("-")[0];
    const postId = id.split("-")[1];
    if (!(type && postId)) return Promise.reject("Invalid Id");
    const cached = await this.redisClient.get(id);
    if (cached) return cached;
    if (type && type.toLowerCase() === "faq") {
      const item = await Faqs.findOne(
        { _id: postId },
        { title: 1, type: 1, description: 1, _id: 1 },
      );
      if (item) {
        console.log("FAQ Post", item);
        await this.redisClient.set(id, JSON.stringify(item));
        return Promise.resolve(item);
      } else {
        return Promise.reject("No Item Found");
      }
    } else {
      const item = await Helps.findOne(
        { _id: postId },
        {
          title: 1,
          type: 1,
          description: 1,
          subtitle: 1,
          image: 1,
          altText: 1,
          paragraph: 1,
          _id: 1,
        },
      );
      if (item) {
        console.log("HELP Post", item);
        await this.redisClient.set(id, JSON.stringify(item));
        return Promise.resolve(item);
      } else {
        return Promise.reject("No Item Found");
      }
    }
  }

  async createPost(data: any) {
    if (data.type === "faq") {
      const { type, title, description, email }: IFaq = data;
      const faq = new Faqs({
        type,
        title,
        description,
        email,
        createdBy: { email, createdOn: new Date() },
        modifiedBy: { email, modifiedOn: new Date() },
      });
      return new Promise((resolve, reject) => {
        faq.save((err: any, faq: any) => {
          if (err) {
            console.log("Some error in saving faq post");
            reject(err);
          }
          console.log("Successfully saved faq with id=", faq._id.toString());
          const { _id, type, title, description }: IFaq = faq;
          this.redisClient.del(`${type}-all`);
          resolve({
            _id: _id?.toString(),
            type,
            title,
            description,
            email,
          });
        });
      });
    } else {
      const {
        type,
        title,
        description,
        email,
        subtitle,
        image,
        altText,
        paragraph,
      }: IHelp = data;
      const help = new Helps({
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
        help.save((err: any, help: any) => {
          if (err) {
            console.log("Some error in saving help post");
            reject(err);
          }
          console.log("Successfully saved help with id=", help._id.toString());
          const {
            _id,
            type,
            title,
            description,
            subtitle,
            image,
            altText,
            paragraph,
          }: IHelp = help;
          this.redisClient.del(`${type}-all`);
          resolve({
            _id: _id?.toString(),
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
  }

  async updatePost(data: any) {
    if (data.type === "faq") {
      const { type, title, description, email }: IFaq = data;
      const post: any = await Faqs.findOne({ _id: data._id });
      post.title = title;
      post.description = description;
      post.modifiedBy = { email, modifiedOn: new Date() };
      return new Promise((resolve, reject) => {
        post.save((err: any, faq: any) => {
          if (err) {
            console.log("Some error in saving faq post");
            reject(err);
          }
          console.log("Successfully updated faq with id=", faq._id.toString());
          const { _id, type, title, description }: IFaq = faq;
          this.redisClient.del(`${type}-all`);
          resolve({ _id, type, title, description, email });
        });
      });
    } else {
      const {
        type,
        title,
        description,
        email,
        subtitle,
        image,
        altText,
        paragraph,
      }: IHelp = data;
      const post: any = await Helps.findOne({ _id: data._id });
      post.title = title;
      post.description = description;
      post.modifiedBy = { email, modifiedOn: new Date() };
      post.subtitle = subtitle;
      post.image = image;
      post.altText = altText;
      post.paragraph = paragraph;
      return new Promise((resolve, reject) => {
        post.save((err: any, help: any) => {
          if (err) {
            console.log("Some error in saving help post");
            reject(err);
          }
          console.log(
            "Successfully updated help with id=",
            help._id.toString(),
          );
          const {
            _id,
            type,
            title,
            description,
            subtitle,
            image,
            altText,
            paragraph,
          }: IHelp = help;
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
  }

  async deletePost(id: string) {
    const type = id.split("-")[0];
    const postId = id.split("-")[1];
    if (!(type && postId)) return Promise.reject("Invalid Id");
    const cached = await this.redisClient.get(`${id}-del`);
    if (cached) return cached;
    if (type && type.toLowerCase() === "faq") {
      const item = await Faqs.deleteOne({ _id: postId });
      if (item) {
        console.log("FAQ Item deleted with id=", postId);
        await this.redisClient.del(`${type}-all`);
        await this.redisClient.set(`${type}-del`, JSON.stringify(item));
        return Promise.resolve(item);
      } else {
        return Promise.reject("No Item Found");
      }
    } else {
      const item = await Helps.deleteOne({ _id: postId });
      if (item) {
        console.log("HELP Item deleted with id=", postId);
        await this.redisClient.del(`${type}-all`);
        await this.redisClient.set(`${id}-del`, JSON.stringify(item));
        return Promise.resolve(item);
      } else {
        return Promise.reject("No Item Found");
      }
    }
  }
}

export default new PostService();
