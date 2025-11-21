using UnityEngine;
using NotebookWar.Player;

namespace NotebookWar.Pickups
{
    public class BoostPickup : PickupBase
    {
        [Header("Boost Settings")]
        [SerializeField] private BoostType boostType;
        [SerializeField] private float boostMultiplier = 1.5f;
        [SerializeField] private float boostDuration = 10f;
        
        public enum BoostType
        {
            Speed,
            Damage,
            Health
        }

        protected override void ApplyEffect(GameObject player)
        {
            BoostManager boostManager = player.GetComponent<BoostManager>();
            if (boostManager == null)
            {
                boostManager = player.AddComponent<BoostManager>();
            }
            
            boostManager.ApplyBoost(boostType, boostMultiplier, boostDuration);
        }
    }

    public class BoostManager : MonoBehaviour
    {
        private PlayerController playerController;
        private System.Collections.Generic.Dictionary<BoostPickup.BoostType, BoostEffect> activeBoosts;

        private void Awake()
        {
            playerController = GetComponent<PlayerController>();
            activeBoosts = new System.Collections.Generic.Dictionary<BoostPickup.BoostType, BoostEffect>();
        }

        private void Update()
        {
            UpdateBoosts();
        }

        public void ApplyBoost(BoostPickup.BoostType type, float multiplier, float duration)
        {
            if (activeBoosts.ContainsKey(type))
            {
                // Refresh existing boost
                activeBoosts[type].duration = duration;
                activeBoosts[type].multiplier = multiplier;
            }
            else
            {
                // Add new boost
                BoostEffect boost = new BoostEffect
                {
                    type = type,
                    multiplier = multiplier,
                    duration = duration
                };
                
                activeBoosts[type] = boost;
                ApplyBoostEffect(boost);
            }
        }

        private void UpdateBoosts()
        {
            var boostsToRemove = new System.Collections.Generic.List<BoostPickup.BoostType>();
            
            foreach (var kvp in activeBoosts)
            {
                kvp.Value.duration -= Time.deltaTime;
                
                if (kvp.Value.duration <= 0)
                {
                    boostsToRemove.Add(kvp.Key);
                }
            }
            
            foreach (var boostType in boostsToRemove)
            {
                RemoveBoostEffect(activeBoosts[boostType]);
                activeBoosts.Remove(boostType);
            }
        }

        private void ApplyBoostEffect(BoostEffect boost)
        {
            switch (boost.type)
            {
                case BoostPickup.BoostType.Speed:
                    // Speed boost would modify movement speed
                    break;
                case BoostPickup.BoostType.Damage:
                    // Damage boost would modify weapon damage
                    break;
                case BoostPickup.BoostType.Health:
                    // Health boost would modify max health temporarily
                    break;
            }
        }

        private void RemoveBoostEffect(BoostEffect boost)
        {
            // Restore original values when boost expires
        }

        public bool HasBoost(BoostPickup.BoostType type)
        {
            return activeBoosts.ContainsKey(type);
        }

        public float GetBoostMultiplier(BoostPickup.BoostType type)
        {
            return activeBoosts.ContainsKey(type) ? activeBoosts[type].multiplier : 1f;
        }
    }

    [System.Serializable]
    public class BoostEffect
    {
        public BoostPickup.BoostType type;
        public float multiplier;
        public float duration;
    }
}