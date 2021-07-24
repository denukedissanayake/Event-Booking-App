const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')


module.exports = {

    createUser: async (args) => {

        try {
            const exsistingUser = await User.findOne({ email: args.userInput.email })

            if (exsistingUser ) {
                throw new Error('Already Exists User!')
            }
    
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
            });
    
            const result = await user.save()
    
            return { ...result._doc, _id: result.id, password: null }
            
        } catch (err) {
            throw err;
        }
    },

    login: async ({email, password}) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not Exist!')
        }

        const isEqual = await bcrypt.compare(password, user.password)

        if (!isEqual) {
            throw new Error("Entered Password is Not Correct!")
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            { expiresIn: '1h' }
        )

        return { userId: user.id, token: token, tokenExpiration: 1}
    }
}