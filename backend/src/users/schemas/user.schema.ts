import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({
  collection: 'users',
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret._id
      delete ret.password_hash
      return ret
    },
  },
})
export class User {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string

  @Prop({ required: true })
  password_hash!: string

  @Prop({ required: true, enum: ['admin', 'member', 'viewer'], default: 'member' })
  role!: 'admin' | 'member' | 'viewer'

  @Prop({ required: true, enum: ['active', 'disabled'], default: 'active' })
  status!: 'active' | 'disabled'

  @Prop({ type: String, default: null })
  avatar_url!: string | null

  @Prop({ default: () => new Date().toISOString() })
  created_at!: string

  @Prop({ default: () => new Date().toISOString() })
  updated_at!: string

  @Prop({ type: String, default: null })
  last_login_at!: string | null
}

export const UserSchema = SchemaFactory.createForClass(User)
