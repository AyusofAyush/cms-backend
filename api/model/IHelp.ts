export default interface IHelp {
  _id: string;
  type: string;
  title: string;
  description: string;
  subtitle?: string;
  image?: string;
  altText?: string;
  paragraph: string;
  email?: string;
}
