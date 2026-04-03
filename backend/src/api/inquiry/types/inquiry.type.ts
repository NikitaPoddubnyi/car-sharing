import { HydratedDocument } from "mongoose";
import { Inquiry } from "../schemas/inquiry.schema";

export type InquiryDocument = HydratedDocument<Inquiry>;
