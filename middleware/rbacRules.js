const rbacRules = {
    citizen: {
        can: [
            '/api/announcements:get',
            '/api/users:*',
            '/api/chat-messages:*',
            '/api/private-chat-messages:*',
            '/api/usersList:*',
            '/api/resources:*',
            '/api/emergencyStatusDetail:*',
            '/api/spam-report:*',
            '/api/test:*'
        ]
    },
    coordinator: {
        can: ['/api/announcements:post'],
        inherits:['citizen']
    },
    administrator: {
        can: [

        ],
        inherits:['coordinator']
    }
}

module.exports = rbacRules;


