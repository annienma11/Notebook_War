using UnityEngine;
using NotebookWar.Player;

namespace NotebookWar.Pickups
{
    public class MedkitPickup : PickupBase
    {
        [Header("Medkit Settings")]
        [SerializeField] private float healAmount = 50f;
        [SerializeField] private bool healToFull = false;

        protected override bool CanPickup(GameObject player)
        {
            PlayerController playerController = player.GetComponent<PlayerController>();
            if (playerController == null) return false;

            // Only pickup if player is not at full health
            return playerController.GetCurrentHealth() < playerController.GetMaxHealth();
        }

        protected override void ApplyEffect(GameObject player)
        {
            PlayerController playerController = player.GetComponent<PlayerController>();
            if (playerController == null) return;

            if (healToFull)
            {
                playerController.Heal(playerController.GetMaxHealth());
            }
            else
            {
                playerController.Heal(healAmount);
            }
        }
    }
}