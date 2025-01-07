import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User methods
interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

// Interface for User document
interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Interface for User model
interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
