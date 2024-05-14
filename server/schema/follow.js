const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: String
        followerId: String
        createdAt: String
        updatedAt: String
        following: FollowingDetail
        follower: FollowerDetail
    }

    type FollowingDetail {
        _id: ID
        name: String
        email: String
    }

    type FollowerDetail {
        _id: ID
        name: String
        email: String
    }

    type Query {
        findFollowing:  [Follow]
        findFollower:  [Follow]
    }

    type Mutation {
         addFollowing(followingId: String, ) : Follow   
    }
`;

module.exports = typeDefs;
