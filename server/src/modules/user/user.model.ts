import { getModelForClass, pre, prop } from "@typegoose/typegoose";
// typegoose is used to create a model and allow us to export an interface model from the same class

import argon2 from "argon2";
// when we register the user  we want tohash theri r passwords that is somethin unpredicatiblethat  is why we used argon 2


//presavehook
@pre<User>("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await argon2.hash(this.password);

    this.password = hash;

    return next();
  }
})
export class User {
  @prop({ required: true, unique: true })

  email: string;

  @prop({ required: true })

  password: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
