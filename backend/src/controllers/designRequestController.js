const DesignRequest = require('../models/DesignRequest');

// @desc    Create a new design request
// @route   POST /api/design-requests
// @access  Public (Optional User)
const createDesignRequest = async (req, res) => {
    try {
        const { name, email, phone, designId, message } = req.body;

        if (!name || !email || !designId) {
            return res.status(400).json({ message: 'Name, email, and design are required' });
        }

        const designRequest = new DesignRequest({
            user: req.user ? req.user._id : undefined,
            name,
            email,
            phone,
            designId,
            message
        });

        const createdRequest = await designRequest.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        console.error('Create design request error:', error);
        res.status(500).json({ message: 'Failed to submit request' });
    }
};

// @desc    Get all design requests (Admin)
// @route   GET /api/design-requests
// @access  Private/Admin
const getDesignRequests = async (req, res) => {
    try {
        const requests = await DesignRequest.find({})
            .populate('designId', 'imageUrl name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json(requests);
    } catch (error) {
        console.error('Get design requests error:', error);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
};

// @desc    Update design request status (Admin)
// @route   PUT /api/design-requests/:id/status
// @access  Private/Admin
const updateDesignRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const request = await DesignRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status || request.status;
        const updatedRequest = await request.save();

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error('Update design request status error:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
};

module.exports = {
    createDesignRequest,
    getDesignRequests,
    updateDesignRequestStatus
};
