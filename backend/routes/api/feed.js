const router = require('express').Router();

const {Announcement} = require('../../models');
const{fakeAuth,requireRole}=require('../../middlewares/auth')
// lire ?page=1&limit=10 
function getPagination(query) {
    const page= Math.max( parseInt(query.page, 10) || 1 , 1);
    const limit= Math.min ( Math.max( parseInt(query.limit, 10) || 10 , 1), 50 );
    return { page, limit, skip: (page - 1) * limit };
}
// US22 : GET /api/announcements : feed 
router.get('/', fakeAuth, requireRole('etudiant'), async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const filter = { statut: 'PUBLIEE' };
        const [items , total] = await Promise.all([
            Announcement.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('titre description categorie auteur medias createdAt')
            .populate('categorie', 'nom')
            .populate('auteur', 'nom prenom'),
            Announcement.countDocuments(filter)
        ]);
        res.json({
             data: items, 
             page,
             limit,
             total,
             totalPages: Math.ceil(total / limit), 
            });
    } catch (error) {
        next(error);
    }
});
// US26 : Get /api/announcements/mine : les annonces de l'étudiant connecté
router.get('/mine', fakeAuth, requireRole('etudiant'), async (req, res, next) => {
    try {
        const items = await Announcement.find({ auteur: req.user._id })
            .sort({ createdAt: -1 })
            .populate('categorie', 'nom');
           
        res.json({ items });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
