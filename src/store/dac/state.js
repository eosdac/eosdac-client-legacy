export default {
  //
  isLoaded: false,
  memberTerms: null,
  custodians: null,
  candidates: null,
  custodianPermissions: null,
  dacAdmins: [],
  custodianConfig: {
    lockupasset: null,
    maxvotes: null,
    numelected: null,
    periodlength: null,
    authaccount: null,
    tokenholder: null,
    serviceprovider: null,
    should_pay_via_service_provider: null,
    initial_vote_quorum_percent: null,
    vote_quorum_percent: null,
    auth_threshold_high: null,
    auth_threshold_mid: null,
    auth_threshold_low: null,
    lockup_release_time_delay: null,
    requested_pay_max: null
  },

  custodianState: {
    lastperiodtime: null,
    total_weight_of_votes: null,
    total_votes_on_candidates: null,
    number_active_candidates: null,
    met_initial_votes_threshold: null
  },

  wpConfig: {
    service_account: null,
    authority_account: null,
    member_terms_account: null,
    treasury_account: null,
    proposal_threshold: null,
    proposal_approval_threshold_percent: null,
    claim_threshold: null,
    claim_approval_threshold_percent: null,
    escrow_expiry: null
  },
  wpCategories: require("../../extensions/statics/config/wp_categories.json")
};
